import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<SessionRecord[]>(() => {
        const saved = localStorage.getItem('pomodoro-history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('pomodoro-history', JSON.stringify(history));
    }, [history]);

    const addSession = (session: Omit<SessionRecord, 'id'>) => {
        const newSession: SessionRecord = {
            ...session,
            id: crypto.randomUUID(),
        };
        // Add new session to the beginning of the list
        setHistory((prev) => [newSession, ...prev]);
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <HistoryContext.Provider value={{ history, addSession, clearHistory }}>
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
