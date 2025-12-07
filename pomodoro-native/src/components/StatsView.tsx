import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useHistory } from '../context/HistoryContext';
import { getDailyStats, getWeeklyStats, getMonthlyStats, getYearlyStats } from '../utils/statsUtils';
import { X, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react-native';

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
                <View style={styles.dayStats}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Odaklanma Süresi</Text>
                        <Text style={styles.statValue}>{stats.totalMinutes} dk</Text>
                        <Text style={styles.statSub}>{(stats.totalMinutes / 60).toFixed(1)} Saat</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Oturum Sayısı</Text>
                        <Text style={styles.statValue}>{stats.sessions}</Text>
                        <Text style={styles.statSub}>Pomodoro</Text>
                    </View>
                </View>
            );
        }

        if (activeTab === 'week') {
            const stats = getWeeklyStats(history, currentDate);
            const maxMin = Math.max(...stats.map(s => s.minutes), 60);
            return (
                <View style={styles.chartContainer}>
                    <View style={styles.weekChart}>
                        {stats.map((s, i) => (
                            <View key={i} style={styles.barContainer}>
                                <View
                                    style={[styles.bar, { height: (s.minutes / maxMin) * 200 }]}
                                />
                                <Text style={styles.barLabel}>{s.dayName}</Text>
                                <Text style={[styles.barLabel, { fontSize: 10 }]}>{s.minutes}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={{ textAlign: 'center', color: '#94a3b8', marginTop: 20 }}>
                        Toplam: {stats.reduce((a, b) => a + b.minutes, 0)} dk
                    </Text>
                </View>
            );
        }

        if (activeTab === 'month') {
            const stats = getMonthlyStats(history, currentDate.getMonth(), currentDate.getFullYear());
            const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const offset = firstDay === 0 ? 6 : firstDay - 1;

            return (
                <View>
                    <View style={styles.calendarHeader}>
                        {days.map(d => <Text key={d} style={styles.dayHeader}>{d}</Text>)}
                    </View>
                    <View style={styles.calendarGrid}>
                        {Array.from({ length: offset }).map((_, i) => (
                            <View key={`empty-${i}`} style={[styles.calendarDay, { backgroundColor: 'transparent', borderWidth: 0 }]} />
                        ))}
                        {stats.map(day => {
                            let bg = 'rgba(255,255,255,0.02)';
                            if (day.intensity === 1) bg = 'rgba(99, 102, 241, 0.2)';
                            if (day.intensity === 2) bg = 'rgba(99, 102, 241, 0.4)';
                            if (day.intensity === 3) bg = 'rgba(99, 102, 241, 0.6)';
                            if (day.intensity === 4) bg = 'rgba(99, 102, 241, 0.9)';

                            return (
                                <View key={day.day} style={[styles.calendarDay, { backgroundColor: bg }]}>
                                    <Text style={styles.dayText}>{day.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            );
        }

        if (activeTab === 'year') {
            const stats = getYearlyStats(history, currentDate.getFullYear());
            return (
                <View style={styles.yearGrid}>
                    {stats.map(m => (
                        <View key={m.monthName} style={styles.yearMonth}>
                            <Text style={styles.monthName}>{m.monthName}</Text>
                            <Text style={styles.monthValue}>{Math.round(m.totalMinutes / 60)}</Text>
                            <Text style={styles.monthSub}>Saat</Text>
                        </View>
                    ))}
                </View>
            );
        }
    };

    return (
        <Modal visible={isOpen} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>İstatistikler</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tabs}>
                        {(['day', 'week', 'month', 'year'] as Tab[]).map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.tab, activeTab === t && styles.activeTab]}
                                onPress={() => setActiveTab(t)}
                            >
                                <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>
                                    {t === 'day' ? 'Gün' : t === 'week' ? 'Hafta' : t === 'month' ? 'Ay' : 'Yıl'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.navRow}>
                        <TouchableOpacity onPress={() => navigate(-1)}>
                            <ChevronLeft size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.dateTitle}>{formatDate(currentDate)}</Text>
                        <TouchableOpacity onPress={() => navigate(1)}>
                            <ChevronRight size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1 }}>
                        {renderContent()}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#0f172a',
        height: '90%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    tabText: {
        color: '#94a3b8',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dayStats: {
        gap: 15,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    statLabel: {
        color: '#94a3b8',
        marginBottom: 5,
    },
    statValue: {
        color: '#6366f1',
        fontSize: 32,
        fontWeight: 'bold',
    },
    statSub: {
        color: '#64748b',
    },
    chartContainer: {
        height: 300,
        justifyContent: 'center',
    },
    weekChart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 200,
        paddingHorizontal: 10,
    },
    barContainer: {
        alignItems: 'center',
        width: 30,
    },
    bar: {
        width: '100%',
        backgroundColor: '#6366f1',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        minHeight: 4,
    },
    barLabel: {
        color: '#94a3b8',
        fontSize: 12,
        marginTop: 5,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    dayHeader: {
        color: '#94a3b8',
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: 6,
    },
    dayText: {
        color: '#fff',
        fontSize: 12,
    },
    yearGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    yearMonth: {
        width: '30%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    monthName: {
        color: '#94a3b8',
        fontSize: 12,
    },
    monthValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    monthSub: {
        color: '#64748b',
        fontSize: 10,
    },
});

export default StatsView;
