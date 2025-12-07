import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useHistory } from '../context/HistoryContext';
import { X, Save } from 'lucide-react';
import './SettingsForm.css';

interface SettingsFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ isOpen, onClose }) => {
    const { settings, updateSettings } = useSettings();
    const { clearHistory } = useHistory();
    const [localSettings, setLocalSettings] = useState(settings);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            [name]: name === 'userName' ? value : Number(value)
        }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        onClose();
    };

    const handleThemeChange = (t: any) => {
        setLocalSettings(prev => ({ ...prev, theme: t }));
    };

    return (
        <div className="settings-overlay">
            <div className="glass-panel settings-modal">
                <div className="settings-header">
                    <h2>Ayarlar</h2>
                    <button className="btn-reset close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="settings-body">
                    <div className="form-group">
                        <label>Odaklanma (dk)</label>
                        <input
                            type="number"
                            name="workDuration"
                            value={localSettings.workDuration}
                            onChange={handleChange}
                            min="1" max="60"
                        />
                    </div>
                    <div className="form-group">
                        <label>Kısa Mola (dk)</label>
                        <input
                            type="number"
                            name="shortBreakDuration"
                            value={localSettings.shortBreakDuration}
                            onChange={handleChange}
                            min="1" max="30"
                        />
                    </div>
                    <div className="form-group">
                        <label>Uzun Mola (dk)</label>
                        <input
                            type="number"
                            name="longBreakDuration"
                            value={localSettings.longBreakDuration}
                            onChange={handleChange}
                            min="1" max="60"
                        />
                    </div>
                    <div className="form-group">
                        <label>Uzun Mola Aralığı (oturum)</label>
                        <input
                            type="number"
                            name="sessionsBeforeLongBreak"
                            value={localSettings.sessionsBeforeLongBreak}
                            onChange={handleChange}
                            min="1" max="10"
                        />
                    </div>
                    <div className="form-group">
                        <label>Günlük Hedef (oturum)</label>
                        <input
                            type="number"
                            name="dailyGoal"
                            value={localSettings.dailyGoal}
                            onChange={handleChange}
                            min="1" max="20"
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="userName"
                            value={localSettings.userName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="settings-footer">
                    <button className="btn-save" onClick={handleSave}>
                        <Save size={18} /> Kaydet
                    </button>
                </div>
            </div>
            <div className="form-group" style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <h4 style={{ color: '#ff6b6b', marginBottom: '0.5rem' }}>Tehlikeli Bölge</h4>
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm('Tüm geçmiş verileriniz silinecek. Bu işlem geri alınamaz. Emin misiniz?')) {
                            clearHistory();
                            alert('Veriler silindi.');
                        }
                    }}
                    className="settings-btn"
                    style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', borderColor: '#ff6b6b' }}
                >
                    Tüm Verilerimi Sil
                </button>
            </div>
        </div>
    );
};

export default SettingsForm;
