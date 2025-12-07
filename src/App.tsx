import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings } from './context/SettingsContext';
import { useHistory } from './context/HistoryContext';
import { useTasks } from './context/TaskContext';
import { useAudio } from './context/AudioContext';
import { TimerEngine } from './utils/TimerEngine';
import type { TimerMode } from './utils/TimerEngine';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SettingsForm from './components/SettingsForm';
import SessionCompleteModal from './components/SessionCompleteModal';
import HistoryView from './components/HistoryView';
import TaskSelector from './components/TaskSelector';
import WhyScreen from './components/WhyScreen';
import AmbiencePanel from './components/AmbiencePanel';
import StatsView from './components/StatsView';
import { Settings as SettingsIcon, History as HistoryIcon, User, BarChart2 } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
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

  // Track actual start time for history (resets on session completion/discard)
  const sessionStartTimeRef = useRef<number>(Date.now());

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    // If we finished a WORK session
    if (mode === 'work') {
      playNotification('complete'); // Uplifting sound
      if (navigator.vibrate) navigator.vibrate([500, 200, 500]); // Vibrate pattern
      const duration = settings.workDuration;
      setLastSessionDuration(duration);
      setIsSessionModalOpen(true);
    } else {
      // Break finished
      playNotification('break'); // Back to work sound
      setMode('work');
    }
  }, [mode, settings.workDuration, playNotification]);

  // Update ref whenever callback changes
  useEffect(() => {
    handleCompleteRef.current = handleTimerComplete;
  }, [handleTimerComplete]);

  // Initialize Timer Engine
  useEffect(() => {
    const getDuration = (m: TimerMode, s: Settings) => {
      switch (m) {
        case 'work': return s.workDuration * 60;
        case 'shortBreak': return s.shortBreakDuration * 60;
        case 'longBreak': return s.longBreakDuration * 60;
      }
    };

    const initialDuration = getDuration(mode, settings);
    setRemainingTime(initialDuration);

    engineRef.current = new TimerEngine(
      initialDuration,
      (remaining) => setRemainingTime(remaining),
      () => handleCompleteRef.current()
    );
    return () => { engineRef.current?.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Update duration when settings change (if timer not running)
  useEffect(() => {
    if (isRunning) return;

    const getDuration = (m: TimerMode, s: Settings) => {
      switch (m) {
        case 'work': return s.workDuration * 60;
        case 'shortBreak': return s.shortBreakDuration * 60;
        case 'longBreak': return s.longBreakDuration * 60;
      }
    };

    const newDuration = getDuration(mode, settings);
    engineRef.current?.reset(newDuration);
    setRemainingTime(newDuration);

  }, [settings, mode]); // Removed isRunning to prevent reset on pause

  const handleSessionDiscard = () => {
    setIsSessionModalOpen(false);
    setCurrentCommitment(''); // Reset commitment

    const newCompleted = completedSessions + 1;
    setCompletedSessions(newCompleted);

    // Determine next mode
    setMode(() => {
      if (newCompleted % settings.sessionsBeforeLongBreak === 0) {
        return 'longBreak';
      } else {
        return 'shortBreak';
      }
    });
  };

  const handleSessionSave = (note: string) => {
    addSession({
      startTime: sessionStartTimeRef.current, // Use actual start time
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
      // If starting work and at the very beginning (full duration), show Why Screen
      const fullDuration = settings.workDuration * 60;
      if (mode === 'work' && remainingTime === fullDuration) {
        setIsWhyOpen(true);
      } else {
        if (navigator.vibrate) navigator.vibrate(200); // Short vibration
        playNotification('start');
        sessionStartTimeRef.current = Date.now();
        engineRef.current?.start();
        setIsRunning(true);
      }
    }
  };

  const handleWhyCommit = (reason: string) => {
    setCurrentCommitment(reason);
    setIsWhyOpen(false);
    if (navigator.vibrate) navigator.vibrate(200);
    playNotification('start');
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
    // Skip does not count as success
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
    <div className={`app - container ${mode} `}>
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <nav className="top-nav glass-panel">
        <div className="logo">Pomodoro</div>
        <div className="user-info">
          {settings.userName && <span className="user-name">Merhaba, {settings.userName}</span>}
          <button className="btn-icon" onClick={() => setIsHistoryOpen(true)} title="Geçmiş">
            <HistoryIcon size={24} />
          </button>
          <button className="btn-icon" onClick={() => setIsStatsOpen(true)} title="İstatistikler">
            <BarChart2 size={24} />
          </button>
          <button className="btn-icon" onClick={() => setIsSettingsOpen(true)} title="Ayarlar">
            <SettingsIcon size={24} />
          </button>
        </div>
      </nav>

      <main className="main-content">
        <div className="glass-card main-timer-card">
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
        </div>

        <TaskSelector />
        <AmbiencePanel />

        <div className="stats-container">
          <div className="glass-card stat-card">
            <span className="stat-label">Oturumlar</span>
            <span className="stat-value">{completedSessions} / {settings.dailyGoal}</span>
          </div>
        </div>
      </main>

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
    </div>
  );
}

export default App;
