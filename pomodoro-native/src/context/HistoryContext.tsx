import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionRecord {
    id: string;
    startTime: number; // timestamp
    endTime: number; // timestamp
    duration: number; // in minutes
    type: 'work';
    note: string;
    taskId?: string;
    commitment?: string;
}

interface HistoryContextType {
    history: SessionRecord[];
    addSession: (session: Omit<SessionRecord, 'id'>) => void;
    clearHistory: () => void;
    isLoading: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<SessionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem('pomodoro-history');
            if (saved) {
                setHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load history', e);
        } finally {
            setIsLoading(false);
        }
    };

    const saveHistory = async (newHistory: SessionRecord[]) => {
        try {
            await AsyncStorage.setItem('pomodoro-history', JSON.stringify(newHistory));
        } catch (e) {
            console.error('Failed to save history', e);
        }
    };

    const addSession = (session: Omit<SessionRecord, 'id'>) => {
        const newSession: SessionRecord = {
            ...session,
            id: generateId(),
        };
        // Add new session to the beginning of the list
        const updatedHistory = [newSession, ...history];
        setHistory(updatedHistory);
        saveHistory(updatedHistory);
    };

    const clearHistory = () => {
        setHistory([]);
        saveHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addSession, clearHistory, isLoading }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
