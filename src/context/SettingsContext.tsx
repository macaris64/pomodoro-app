import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'default' | 'minimal' | 'cyberpunk' | 'pastel';

export interface Settings {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    dailyGoal: number;
    sessionsBeforeLongBreak: number;
    userName: string;
    theme: Theme;
}

const defaultSettings: Settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    dailyGoal: 8,
    sessionsBeforeLongBreak: 4,
    userName: '',
    theme: 'default'
};

interface SettingsContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('pomodoro-settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
        document.body.className = `theme-${settings.theme}`;
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
