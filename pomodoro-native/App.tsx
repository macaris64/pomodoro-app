import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, KeyboardAvoidingView, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings as SettingsIcon, History as HistoryIcon, User, BarChart2 } from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { HistoryProvider, useHistory } from './src/context/HistoryContext';
import { TaskProvider, useTasks } from './src/context/TaskContext';
import { AudioProvider, useAudio } from './src/context/AudioContext';

import { TimerEngine, TimerMode } from './src/utils/TimerEngine';
import TimerDisplay from './src/components/TimerDisplay';
import Controls from './src/components/Controls';
import TaskSelector from './src/components/TaskSelector';
import AmbiencePanel from './src/components/AmbiencePanel';
import SettingsForm from './src/components/SettingsForm';
import HistoryView from './src/components/HistoryView';
import SessionCompleteModal from './src/components/SessionCompleteModal';
import WhyScreen from './src/components/WhyScreen';
import StatsView from './src/components/StatsView';

const MainLayout = () => {
    const insets = useSafeAreaInsets();
    const { settings } = useSettings();
    const { addSession } = useHistory();
    const { activeTaskId, tasks } = useTasks();
    const { playNotification } = useAudio();

    const [mode, setMode] = useState<TimerMode>('work');
    const [remainingTime, setRemainingTime] = useState(settings.workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [isWhyOpen, setIsWhyOpen] = useState(false);

    const [lastSessionDuration, setLastSessionDuration] = useState(0);
    const [currentCommitment, setCurrentCommitment] = useState('');

    const engineRef = useRef<TimerEngine | null>(null);
    const handleCompleteRef = useRef<() => void>(() => { });
    const sessionStartTimeRef = useRef<number>(Date.now());

    // THEME COLORS
    const getThemeColors = (): readonly [string, string, ...string[]] => {
        switch (settings.theme) {
            case 'cyberpunk': return ['#050505', '#002211'];
            default: return ['#0f172a', '#1e1b4b'];
        }
    };

    const handleTimerComplete = useCallback(() => {
        // If we finished a WORK session
        if (mode === 'work') {
            playNotification('complete');
            Vibration.vibrate([0, 500, 200, 500]); // Vibrate pattern
            const duration = settings.workDuration;
            setLastSessionDuration(duration);
            setIsSessionModalOpen(true);
        } else {
            playNotification('break');
            setMode('work');
        }
    }, [mode, settings.workDuration, playNotification]);

    useEffect(() => {
        handleCompleteRef.current = handleTimerComplete;
    }, [handleTimerComplete]);

    // Init Timer
    useEffect(() => {
        const getDuration = (m: TimerMode) => {
            switch (m) {
                case 'work': return settings.workDuration * 60;
                case 'shortBreak': return settings.shortBreakDuration * 60;
                case 'longBreak': return settings.longBreakDuration * 60;
            }
        };

        const initialDuration = getDuration(mode);
        // Don't reset if just re-rendering, but currently we are simpler
        // We only reset if settings changed substantially? 
        // Actually this runs on mount and we need re-instantiation if implementation changes.
        // Or we just instantiate once.

        // Simpler: Just instantiate once
        engineRef.current = new TimerEngine(
            initialDuration,
            (remaining) => setRemainingTime(remaining),
            () => handleCompleteRef.current()
        );

        setRemainingTime(initialDuration);

        return () => { engineRef.current?.stop(); };
    }, []); // Run ONCE on mount

    // Update duration on settings change or mode change
    useEffect(() => {
        if (isRunning) return;

        const getDuration = (m: TimerMode) => {
            switch (m) {
                case 'work': return settings.workDuration * 60;
                case 'shortBreak': return settings.shortBreakDuration * 60;
                case 'longBreak': return settings.longBreakDuration * 60;
            }
        };
        const newDuration = getDuration(mode);
        engineRef.current?.reset(newDuration);
        setRemainingTime(newDuration);
    }, [settings, mode]); // Removed isRunning to prevent reset on pause


    const handleSessionDiscard = () => {
        setIsSessionModalOpen(false);
        setCurrentCommitment('');

        const newCompleted = completedSessions + 1;
        setCompletedSessions(newCompleted);

        setMode(prev => {
            if (newCompleted % settings.sessionsBeforeLongBreak === 0) return 'longBreak';
            return 'shortBreak';
        });
    };

    const handleSessionSave = (note: string) => {
        addSession({
            startTime: sessionStartTimeRef.current,
            endTime: Date.now(),
            duration: lastSessionDuration,
            type: 'work',
            note,
            taskId: activeTaskId || undefined,
            commitment: currentCommitment || undefined
        });
        handleSessionDiscard();
    };

    const toggleTimer = () => {
        if (isRunning) {
            engineRef.current?.pause();
            setIsRunning(false);
        } else {
            const fullDuration = settings.workDuration * 60;
            if (mode === 'work' && Math.abs(remainingTime - fullDuration) < 2) {
                // If clean start (tolerance 2s)
                setIsWhyOpen(true);
            } else {
                playNotification('start');
                Vibration.vibrate(100); // Short vibration
                sessionStartTimeRef.current = Date.now();
                engineRef.current?.start();
                setIsRunning(true);
            }
        }
    };

    const handleWhyCommit = (reason: string) => {
        setCurrentCommitment(reason);
        setIsWhyOpen(false);
        playNotification('start');
        Vibration.vibrate(100);
        sessionStartTimeRef.current = Date.now();
        engineRef.current?.start();
        setIsRunning(true);
    };

    const handleReset = () => {
        engineRef.current?.reset();
        setIsRunning(false);
    };

    const handleSkip = () => {
        engineRef.current?.stop();
        setIsRunning(false);

        if (mode === 'work') {
            setMode('shortBreak');
        } else {
            setMode('work');
        }
    };

    const getTotalDuration = () => {
        switch (mode) {
            case 'work': return settings.workDuration * 60;
            case 'shortBreak': return settings.shortBreakDuration * 60;
            case 'longBreak': return settings.longBreakDuration * 60;
        }
    };

    const activeTaskBox = tasks.find(t => t.id === activeTaskId);

    return (
        <LinearGradient
            colors={getThemeColors()}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <StatusBar barStyle="light-content" />

            <View style={styles.navBar}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.logo}>Pomodoro</Text>
                    {settings.userName ? <Text style={styles.userName}> • {settings.userName}</Text> : null}
                </View>

                <View style={styles.navButtons}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setIsStatsOpen(true)}>
                        <BarChart2 size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setIsHistoryOpen(true)}>
                        <HistoryIcon size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => setIsSettingsOpen(true)}>
                        <SettingsIcon size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.card}>
                        <TimerDisplay
                            remainingSeconds={remainingTime}
                            totalSeconds={getTotalDuration()}
                            mode={mode}
                        />
                        <Controls
                            isRunning={isRunning}
                            onToggle={toggleTimer}
                            onReset={handleReset}
                            onSkip={handleSkip}
                        />
                    </View>

                    <TaskSelector />
                    <AmbiencePanel />

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>OTURUMLAR</Text>
                            <Text style={styles.statValue}>{completedSessions} / {settings.dailyGoal}</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODALS */}
            <SettingsForm isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <HistoryView isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
            <StatsView isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

            <SessionCompleteModal
                isOpen={isSessionModalOpen}
                duration={lastSessionDuration}
                onSave={handleSessionSave}
                onDiscard={handleSessionDiscard}
            />

            <WhyScreen
                isOpen={isWhyOpen}
                taskTitle={activeTaskBox?.title}
                onCommit={handleWhyCommit}
                onCancel={() => setIsWhyOpen(false)}
            />

        </LinearGradient>
    );
};

export default function App() {
    return (
        <SafeAreaProvider>
            <SettingsProvider>
                <HistoryProvider>
                    <TaskProvider>
                        <AudioProvider>
                            <MainLayout />
                        </AudioProvider>
                    </TaskProvider>
                </HistoryProvider>
            </SettingsProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 10,
        height: 60,
    },
    logo: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    userName: {
        color: '#94a3b8',
        fontSize: 14,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    iconBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        margin: 20,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 10,
        marginBottom: 4,
    },
    statValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
