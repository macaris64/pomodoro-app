import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
}

interface TaskContextType {
    tasks: Task[];
    activeTaskId: string | null;
    addTask: (title: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    setActiveTask: (id: string | null) => void;
    isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const saved = await AsyncStorage.getItem('pomodoro-tasks');
            if (saved) {
                setTasks(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load tasks', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveTasks = async (newTasks: Task[]) => {
        try {
            await AsyncStorage.setItem('pomodoro-tasks', JSON.stringify(newTasks));
        } catch (e) {
            console.error('Failed to save tasks', e);
        }
    };

    const addTask = (title: string) => {
        const newTask: Task = {
            id: generateId(),
            title,
            completed: false,
            createdAt: Date.now(),
        };
        const updated = [newTask, ...tasks];
        setTasks(updated);
        saveTasks(updated);

        // Automatically select the new task if none selected
        if (!activeTaskId) setActiveTaskId(newTask.id);
    };

    const toggleTask = (id: string) => {
        const updated = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updated);
        saveTasks(updated);
    };

    const deleteTask = (id: string) => {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        saveTasks(updated);
        if (activeTaskId === id) setActiveTaskId(null);
    };

    const setActiveTask = (id: string | null) => {
        setActiveTaskId(id);
    };

    return (
        <TaskContext.Provider value={{ tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask, isLoading }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
