import type { SessionRecord } from '../context/HistoryContext';

export interface DailyStats {
    date: string; // YYYY-MM-DD
    totalMinutes: number;
    sessions: number;
}

export interface WeeklyStats {
    dayName: string; // Pzt, Sal...
    minutes: number;
    date: string;
}

export interface MonthlyStats {
    day: number;
    minutes: number;
    intensity: 0 | 1 | 2 | 3 | 4; // Heatmap level
}

export interface YearlyStats {
    monthName: string;
    totalMinutes: number;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const getDailyStats = (history: SessionRecord[], dateStr: string): DailyStats => {
    const targetDate = dateStr;
    const daySessions = history.filter(s => {
        const d = new Date(s.startTime);
        return formatDate(d) === targetDate;
    });

    const totalMinutes = daySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

    return {
        date: targetDate,
        totalMinutes,
        sessions: daySessions.length
    };
};

export const getWeeklyStats = (history: SessionRecord[], date: Date): WeeklyStats[] => {
    // Determine start of week (Monday)
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    const weekStats: WeeklyStats[] = [];
    const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
        const dateStr = formatDate(currentDate);

        const stats = getDailyStats(history, dateStr);
        weekStats.push({
            dayName: dayNames[i],
            minutes: stats.totalMinutes,
            date: dateStr
        });
    }

    return weekStats;
};

export const getMonthlyStats = (history: SessionRecord[], month: number, year: number): MonthlyStats[] => {
    // month is 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const stats: MonthlyStats[] = [];

    for (let i = 1; i <= daysInMonth; i++) {

        // Fix for timezone offset issues with ISO string if not handled carefully:
        // Let's just create a simplified YYYY-MM-DD string manually to be safe
        const mStr = (month + 1).toString().padStart(2, '0');
        const dStr = i.toString().padStart(2, '0');
        const dateStr = `${year}-${mStr}-${dStr}`;

        const daily = getDailyStats(history, dateStr);

        let intensity: 0 | 1 | 2 | 3 | 4 = 0;
        if (daily.totalMinutes > 0) intensity = 1;
        if (daily.totalMinutes > 25) intensity = 2; // 1 pomodoro
        if (daily.totalMinutes > 100) intensity = 3; // 4 pomodoros
        if (daily.totalMinutes > 200) intensity = 4; // 8+ pomodoros

        stats.push({
            day: i,
            minutes: daily.totalMinutes,
            intensity
        });
    }

    return stats;
};

export const getYearlyStats = (history: SessionRecord[], year: number): YearlyStats[] => {
    const stats: YearlyStats[] = [];
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    for (let i = 0; i < 12; i++) {
        // Filter sessions for this month/year
        const monthMinutes = history.reduce((acc, s) => {
            const d = new Date(s.startTime);
            if (d.getFullYear() === year && d.getMonth() === i) {
                return acc + (s.duration || 0);
            }
            return acc;
        }, 0);

        stats.push({
            monthName: monthNames[i],
            totalMinutes: monthMinutes
        });
    }
    return stats;
};
