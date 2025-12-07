import React from 'react';
import type { TimerMode } from '../utils/TimerEngine';
import ForestDisplay from './ForestDisplay';
import './TimerDisplay.css';

interface TimerDisplayProps {
    remainingSeconds: number;
    totalSeconds: number;
    mode: TimerMode;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, totalSeconds, mode }) => {
    const radius = 120;
    const circumference = 2 * Math.PI * radius;

    // Progress goes from 0 to 1 as time passes
    const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
    const strokeDashoffset = circumference - (progress * circumference);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <div className="timer-circle">
                <svg width="300" height="300" viewBox="0 0 300 300" className="progress-ring">
                    <circle
                        className="progress-ring__circle-bg"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                        fill="transparent"
                        r={radius}
                        cx="150"
                        cy="150"
                    />
                    {/* Background circle for smooth look */}

                    <circle
                        className="progress-ring__circle"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="transparent"
                        r={radius}
                        cx="150"
                        cy="150"
                        style={{
                            strokeDasharray: `${circumference} ${circumference}`,
                            strokeDashoffset,
                            transition: 'stroke-dashoffset 1s linear'
                        }}
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="timer-content">
                    {mode === 'work' && <ForestDisplay progress={progress} />}
                    <div className="time-text">
                        {formatTime(remainingSeconds)}
                    </div>
                    <p className="mode-label">
                        {mode === 'work' ? 'Odaklan' : mode === 'shortBreak' ? 'Kısa Mola' : 'Uzun Mola'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimerDisplay;
