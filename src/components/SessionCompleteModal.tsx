import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import './SessionCompleteModal.css';

interface SessionCompleteModalProps {
    isOpen: boolean;
    onSave: (note: string) => void;
    onDiscard: () => void;
    duration: number; // minutes
}

const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({ isOpen, onSave, onDiscard, duration }) => {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(note);
        setNote(''); // Reset after save
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content">
                <div className="modal-header">
                    <h2>Oturum Tamamlandı! 🎉</h2>
                    <button className="btn-reset close-btn" onClick={onDiscard}>
                        <X size={24} />
                    </button>
                </div>

                <p className="modal-subtitle">
                    Tebrikler, {duration} dakika boyunca odaklandın. Ne üzerinde çalıştığını not al.
                </p>

                <form onSubmit={handleSubmit} className="modal-form">
                    <textarea
                        className="note-input"
                        placeholder="Bu oturumda neler yaptın? (örn. Bug fix, Tasarım, Araştırma...)"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoFocus
                        rows={3}
                    />

                    <div className="modal-actions">
                        <button type="button" className="btn-text" onClick={onDiscard}>
                            Kaydetmeden Geç
                        </button>
                        <button type="submit" className="btn-save">
                            <Save size={18} /> Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SessionCompleteModal;
