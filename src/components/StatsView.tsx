import React, { useState } from 'react';
import { useHistory } from '../context/HistoryContext';
import { getDailyStats, getWeeklyStats, getMonthlyStats, getYearlyStats } from '../utils/statsUtils';
import { X, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import './StatsView.css';

interface StatsViewProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'day' | 'week' | 'month' | 'year';

const StatsView: React.FC<StatsViewProps> = ({ isOpen, onClose }) => {
    const { history } = useHistory();
    const [activeTab, setActiveTab] = useState<Tab>('week');
    const [currentDate, setCurrentDate] = useState(new Date());

    const navigate = (dir: -1 | 1) => {
        const newDate = new Date(currentDate);
        if (activeTab === 'day') newDate.setDate(newDate.getDate() + dir);
        if (activeTab === 'week') newDate.setDate(newDate.getDate() + (dir * 7));
        if (activeTab === 'month') newDate.setMonth(newDate.getMonth() + dir);
        if (activeTab === 'year') newDate.setFullYear(newDate.getFullYear() + dir);
        setCurrentDate(newDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('tr-TR', {
            weekday: activeTab === 'day' ? 'long' : undefined,
            day: activeTab !== 'year' && activeTab !== 'month' ? 'numeric' : undefined,
            month: activeTab !== 'year' ? 'long' : undefined,
            year: 'numeric'
        });
    };

    const renderContent = () => {
        if (activeTab === 'day') {
            const dateStr = currentDate.toISOString().split('T')[0];
            const stats = getDailyStats(history, dateStr);
            return (
                <div className="day-stats animate-in">
                    <div className="stat-card">
                        <h3>Odaklanma Süresi</h3>
                        <div className="stat-value">{stats.totalMinutes} dk</div>
                        <p>{(stats.totalMinutes / 60).toFixed(1)} Saat</p>
                    </div>
                    <div className="stat-card">
                        <h3>Tamamlanan Oturum</h3>
                        <div className="stat-value">{stats.sessions}</div>
                        <p>Pomodoro</p>
                    </div>
                </div>
            );
        }

        if (activeTab === 'week') {
            const stats = getWeeklyStats(history, currentDate);
            const maxMin = Math.max(...stats.map(s => s.minutes), 60); // min 60 for scale
            return (
                <div className="animate-in">
                    <div className="week-chart">
                        {stats.map((s, i) => (
                            <div key={i} className="bar-container">
                                <div
                                    className="bar"
                                    style={{ height: `${(s.minutes / maxMin) * 100}%` }}
                                    title={`${s.minutes} dk`}
                                />
                                <div className="bar-label">{s.dayName}</div>
                                <div className="bar-label" style={{ fontSize: '10px' }}>{s.minutes}</div>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8' }}>
                        Toplam: {stats.reduce((a, b) => a + b.minutes, 0)} dk
                    </p>
                </div>
            );
        }

        if (activeTab === 'month') {
            const stats = getMonthlyStats(history, currentDate.getMonth(), currentDate.getFullYear());
            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

            // Calculate blank spots for start of month
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            // Monday based index (0=Sun -> 6, 1=Mon -> 0);
            const offset = firstDay === 0 ? 6 : firstDay - 1;

            return (
                <div className="animate-in">
                    <div className="calendar-grid">
                        {days.map(d => <div key={d} className="calendar-day-header">{d}</div>)}

                        {Array.from({ length: offset }).map((_, i) => (
                            <div key={`empty-${i}`} className="calendar-day intensity-0" style={{ opacity: 0 }} />
                        ))}

                        {stats.map(day => (
                            <div
                                key={day.day}
                                className={`calendar-day intensity-${day.intensity}`}
                                title={`${day.day} ${currentDate.toLocaleString('tr-TR', { month: 'long' })}: ${day.minutes} dk`}
                            >
                                {day.day}
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div className="calendar-day" style={{ width: 12, height: 12, border: 'none' }} /> 0
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div className="calendar-day intensity-2" style={{ width: 12, height: 12, border: 'none' }} /> 25+
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div className="calendar-day intensity-4" style={{ width: 12, height: 12, border: 'none' }} /> 200+
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'year') {
            const stats = getYearlyStats(history, currentDate.getFullYear());
            return (
                <div className="year-grid animate-in">
                    {stats.map(m => (
                        <div key={m.monthName} className="year-month">
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{m.monthName}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{Math.round(m.totalMinutes / 60)}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>Saat</div>
                        </div>
                    ))}
                </div>
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="stats-overlay">
            <div className="glass-panel stats-modal">
                <div className="stats-header">
                    <div className="flex-center">
                        <BarChart2 size={24} style={{ marginRight: '0.5rem', color: '#6366f1' }} />
                        <h2>İstatistikler</h2>
                    </div>
                    <button className="btn-reset close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="stats-content">
                    <div className="stats-tabs">
                        <button className={`stats-tab ${activeTab === 'day' ? 'active' : ''}`} onClick={() => setActiveTab('day')}>Gün</button>
                        <button className={`stats-tab ${activeTab === 'week' ? 'active' : ''}`} onClick={() => setActiveTab('week')}>Hafta</button>
                        <button className={`stats-tab ${activeTab === 'month' ? 'active' : ''}`} onClick={() => setActiveTab('month')}>Ay</button>
                        <button className={`stats-tab ${activeTab === 'year' ? 'active' : ''}`} onClick={() => setActiveTab('year')}>Yıl</button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button className="btn-icon" onClick={() => navigate(-1)}><ChevronLeft /></button>
                        <h3 style={{ margin: 0 }}>{formatDate(currentDate)}</h3>
                        <button className="btn-icon" onClick={() => navigate(1)}><ChevronRight /></button>
                    </div>

                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StatsView;
