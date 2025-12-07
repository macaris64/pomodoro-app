import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { Audio } from 'expo-av';
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

const SOUND_FILES: Record<SoundType, any> = {
    rain: require('../../assets/sounds/rain.wav'),
    forest: require('../../assets/sounds/forest.wav'),
    wind: require('../../assets/sounds/wind.wav'),
    none: null
};

const NOTIFICATION_FILES = {
    start: require('../../assets/sounds/start.wav'),
    complete: require('../../assets/sounds/complete.wav'),
    break: require('../../assets/sounds/break.wav')
};

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeAmbience, setActiveAmbience] = useState<SoundType>('none');
    const [volume, setVolume] = useState<number>(0.5);

    const synthRef = useRef<SoundSynthesizer | null>(null);
    const nativeSoundRef = useRef<Audio.Sound | null>(null);

    // Initialize Audio Mode for React Native
    useEffect(() => {
        if (Platform.OS !== 'web') {
            Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false
            }).catch(console.error);
        } else {
            synthRef.current = new SoundSynthesizer();
        }

        return () => {
            if (synthRef.current) synthRef.current.stopAmbience();
            if (nativeSoundRef.current) nativeSoundRef.current.unloadAsync();
        };
    }, []);

    // Handle Ambience Changes
    useEffect(() => {
        const handleAmbience = async () => {
            if (Platform.OS === 'web') {
                if (synthRef.current) {
                    synthRef.current.stopAmbience();
                    // Web Synthesizer only supports RAIN/Noise currently properly as per original code
                    if (activeAmbience === 'rain') {
                        synthRef.current.playWhiteNoise(volume);
                    }
                }
            } else {
                // Native
                if (nativeSoundRef.current) {
                    await nativeSoundRef.current.unloadAsync();
                    nativeSoundRef.current = null;
                }

                if (activeAmbience !== 'none') {
                    const { sound } = await Audio.Sound.createAsync(
                        SOUND_FILES[activeAmbience],
                        { shouldPlay: true, isLooping: true, volume: volume }
                    );
                    nativeSoundRef.current = sound;
                }
            }
        };

        handleAmbience();
    }, [activeAmbience]);

    // Handle Volume Changes
    useEffect(() => {
        if (Platform.OS === 'web') {
            // Web Synthesizer volume update is tricky if already playing, need to restart or expose gain node
            // Simplified: restart if playing
            if (activeAmbience === 'rain' && synthRef.current) {
                synthRef.current.playWhiteNoise(volume);
            }
        } else {
            if (nativeSoundRef.current) {
                nativeSoundRef.current.setVolumeAsync(volume);
            }
        }
    }, [volume]);

    const playNotification = async (type: 'start' | 'complete' | 'break') => {
        if (Platform.OS === 'web') {
            synthRef.current?.playTone(0, 'sine', 0, 0); // Wake up context
            synthRef.current?.playNotification(type);
        } else {
            try {
                const { sound } = await Audio.Sound.createAsync(
                    NOTIFICATION_FILES[type],
                    { shouldPlay: true, volume: Math.min(volume + 0.3, 1.0) }
                );
                // Fire and forget, sound unloads automatically garbage collected? No, strict mode warns.
                // ideally we track it. But for notifications it's okay.
                sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                        sound.unloadAsync();
                    }
                });
            } catch (error) {
                console.log('Error playing notification', error);
            }
        }
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
