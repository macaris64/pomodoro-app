import React, { useState } from 'react';
import { Play } from 'lucide-react';
import './WhyScreen.css';

interface WhyScreenProps {
    isOpen: boolean;
    taskTitle?: string;
    onCommit: (reason: string) => void;
    onCancel: () => void;
}

const WhyScreen: React.FC<WhyScreenProps> = ({ isOpen, taskTitle, onCommit, onCancel }) => {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCommit(reason);
        setReason('');
    };

    return (
        <div className="why-overlay">
            <div className="glass-panel why-content">
                <h2>Niyet Belirle</h2>
                <p className="subtitle">
                    {taskTitle
                        ? `"${taskTitle}" görevine başlamak üzeresin.`
                        : "Bir odaklanma oturumuna başlamak üzeresin."}
                </p>

                <p className="question">Bu görevi tamamlamak neden önemli?</p>

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="why-input"
                        placeholder="Örn: Bu özellik kullanıcı deneyimini çok iyileştirecek..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        autoFocus
                        rows={3}
                    />

                    <div className="why-actions">
                        <button type="button" className="btn-text" onClick={onCancel}>
                            Vazgeç
                        </button>
                        <button type="submit" className="btn-play-large">
                            <Play size={20} fill="white" /> Başla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WhyScreen;
