import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import './Controls.css';

interface ControlsProps {
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
    onSkip: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isRunning, onToggle, onReset, onSkip }) => {
    return (
        <div className="controls-container">
            <button className="control-btn secondary" onClick={onReset} title="Sıfırla">
                <RotateCcw size={24} />
            </button>

            <button className={`control-btn primary ${isRunning ? 'running' : ''}`} onClick={onToggle}>
                {isRunning ? <Pause size={32} fill="#fff" /> : <Play size={32} fill="#fff" className="ml-1" />}
            </button>

            <button className="control-btn secondary" onClick={onSkip} title="Sonraki Aşamaya Geç">
                <SkipForward size={24} />
            </button>
        </div>
    );
};

export default Controls;
