import React from 'react';
import { useAudio } from '../context/AudioContext';
import type { SoundType } from '../context/AudioContext';
import { CloudRain, Trees, Coffee, Volume2, Music, VolumeX } from 'lucide-react';
import './AmbiencePanel.css';

const AmbiencePanel: React.FC = () => {
    const { activeAmbience, setActiveAmbience, volume, setVolume } = useAudio();

    const sounds: { id: SoundType, icon: React.ReactNode, label: string }[] = [
        { id: 'none', icon: <VolumeX size={20} />, label: 'Sessiz' },
        { id: 'rain', icon: <CloudRain size={20} />, label: 'Yağmur' },
        { id: 'forest', icon: <Trees size={20} />, label: 'Orman' },
        { id: 'cafe', icon: <Coffee size={20} />, label: 'Kafe' },
    ];

    return (
        <div className="ambience-panel glass-panel">
            <div className="ambience-header">
                <h3><Music size={18} /> Ambiyans</h3>
                <div className="volume-control">
                    <Volume2 size={16} />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="volume-slider"
                    />
                </div>
            </div>

            <div className="sound-grid">
                {sounds.map(sound => (
                    <button
                        key={sound.id}
                        className={`sound-btn ${activeAmbience === sound.id ? 'active' : ''}`}
                        onClick={() => setActiveAmbience(sound.id)}
                        title={sound.label}
                    >
                        {sound.icon}
                        <span className="sound-label">{sound.label}</span>
                    </button>
                ))}
            </div>

            <div className="spotify-link">
                <a href="spotify:playlist:37i9dQZF1DWWQRwui0ExPn" target="_blank" rel="noopener noreferrer" className="spotify-btn">
                    Spotify Lo-Fi Aç (Harici)
                </a>
            </div>
        </div>
    );
};

export default AmbiencePanel;
