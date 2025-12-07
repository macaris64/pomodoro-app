import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('pomodoro-tasks');
        return saved ? JSON.parse(saved) : [];
    });

    const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (title: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            createdAt: Date.now(),
        };
        setTasks(prev => [newTask, ...prev]);
        // Automatically select the new task if none selected? Optional.
        if (!activeTaskId) setActiveTaskId(newTask.id);
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (activeTaskId === id) setActiveTaskId(null);
    };

    const setActiveTask = (id: string | null) => {
        setActiveTaskId(id);
    };

    return (
        <TaskContext.Provider value={{ tasks, activeTaskId, addTask, toggleTask, deleteTask, setActiveTask }}>
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
