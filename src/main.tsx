import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './context/SettingsContext.tsx'
import { HistoryProvider } from './context/HistoryContext.tsx'
import { TaskProvider } from './context/TaskContext.tsx'
import { AudioProvider } from './context/AudioContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <HistoryProvider>
        <TaskProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </TaskProvider>
      </HistoryProvider>
    </SettingsProvider>
  </StrictMode>,
)
