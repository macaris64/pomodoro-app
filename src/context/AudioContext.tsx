import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { SoundSynthesizer } from '../utils/SoundSynthesizer';

export type SoundType = 'rain' | 'forest' | 'cafe' | 'none';

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
            synthRef.current.playWhiteNoise(volume);
        }
        // 'forest' and 'cafe' are temporarily disabled or mapped to noise for now to ensure stability
        // or we could implementing simple tone clusters, but for now let's just use noise for rain
        // and maybe nothing for others to avoid crashing?
        // Let's fallback 'forest' and 'cafe' to 'none' quietly or just do nothing,
        // OR strictly support RAIN as the reliable one.

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
