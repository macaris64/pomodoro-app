import React from 'react';
import { useHistory } from '../context/HistoryContext';
import { X, Calendar } from 'lucide-react';
import './HistoryView.css';

interface HistoryViewProps {
    isOpen: boolean;
    onClose: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ isOpen, onClose }) => {
    const { history, clearHistory } = useHistory();

    if (!isOpen) return null;

    // Group by date
    const groupedHistory = history.reduce((groups, session) => {
        const date = new Date(session.endTime).toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(session);
        return groups;
    }, {} as Record<string, typeof history>);

    return (
        <div className="history-overlay" onClick={onClose}>
            <div className="history-panel glass-panel" onClick={e => e.stopPropagation()}>
                <div className="history-header">
                    <h2>Geçmiş Oturumlar</h2>
                    <button className="btn-reset close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="history-content">
                    {history.length === 0 ? (
                        <div className="empty-history">
                            <Calendar size={48} className="empty-icon" />
                            <p>Henüz kayıtlı oturum yok.</p>
                            <span>Birkaç pomodoro tamamladıktan sonra buraya geri dön!</span>
                        </div>
                    ) : (
                        <div className="history-list">
                            {Object.entries(groupedHistory).map(([date, sessions]) => (
                                <div key={date} className="date-group">
                                    <h3 className="date-header">{date}</h3>
                                    {sessions.map(session => (
                                        <div key={session.id} className="history-item glass-card-sm">
                                            <div className="history-time">
                                                {new Date(session.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(session.endTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="history-details">
                                                <span className="duration-badge">{session.duration} dk</span>
                                                <p className="history-note">{session.note}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <div className="history-footer">
                        <button className="btn-text danger" onClick={() => {
                            if (confirm('Tüm geçmişi silmek istediğine emin misin?')) clearHistory();
                        }}>
                            Geçmişi Temizle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryView;
