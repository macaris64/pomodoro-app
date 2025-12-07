import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { SoundSynthesizer } from '../utils/SoundSynthesizer';

export type SoundType = 'rain' | 'forest' | 'wind' | 'none';

interface AudioContextType {
    activeAmbience: SoundType;
    volume: number;
    setActiveAmbience: (sound: SoundType) => void;
    setVolume: (vol: number) => void;
    playNotification: (type: 'start' | 'complete' | 'break') => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeAmbience, setActiveAmbience] = useState<SoundType>('none');
    const [volume, setVolume] = useState<number>(0.5);

    const synthRef = useRef<SoundSynthesizer | null>(null);

    useEffect(() => {
        synthRef.current = new SoundSynthesizer();
        return () => synthRef.current?.stopAmbience();
    }, []);

    useEffect(() => {
        if (!synthRef.current) return;

        synthRef.current.stopAmbience();

        if (activeAmbience === 'rain') {
            synthRef.current.playWhiteNoise(volume); // Rain
        } else if (activeAmbience === 'forest') {
            synthRef.current.playBrownNoise(volume); // Forest
        } else if (activeAmbience === 'wind') {
            synthRef.current.playWind(volume); // Wind
        }

    }, [activeAmbience, volume]);

    const playNotification = (type: 'start' | 'complete' | 'break') => {
        synthRef.current?.playTone(0, 'sine', 0, 0); // wake up context
        synthRef.current?.playNotification(type);
    };


    return (
        <AudioContext.Provider value={{ activeAmbience, volume, setActiveAmbience, setVolume, playNotification }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within a AudioProvider');
    }
    return context;
};
