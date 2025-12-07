# Premium Pomodoro App 🍅

A modern, feature-rich Pomodoro timer application built with React, TypeScript, and Vite. Designed to boost productivity with a premium aesthetic, gamification elements, and robust session tracking.

## ✨ Features

- **Core Timer Logic**: Accurate timer using `requestAnimationFrame` with Work, Short Break, and Long Break modes.
- **Task Management**: Create tasks, set intentions ("Why are you doing this?"), and link sessions to specific goals.
- **Session History**: detailed log of all completed sessions with notes and timestamps.
- **Audio & Ambience**:
  - Integrated sound synthesizer for notifications (Start, Complete, Break).
  - Ambient white noise (Rain) generator.
- **Gamification (Forest Mode)**: Watch a tree grow as you focus! 🌲
- **Themes**: Switch between multiple visual styles:
  - Default (Deep Blue/Purple)
  - Minimal (Clean Light)
  - Cyberpunk (Neon Green/Black)
  - Pastel (Soft Pink/Lavender)
- **Persisted Settings**: All preferences and history are saved to your browser's local storage.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables & Glassmorphism design system.
- **Icons**: Lucide-React
- **Audio**: Web Audio API (Custom SoundSynthesizer)

## 🚀 Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pomodoro-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📖 How to Use

1.  **Set Your Settings**: Click the **Settings** icon to configure your work duration (default 25m), breaks, daily goals, and theme.
2.  **Add a Task**: Use the "Görevler" panel to add a task you want to work on.
3.  **Start Focusing**: Click the Play button.
    - If it's a new work session, you'll be prompted to set an intention.
4.  **Stay Focused**: Watch the progress ring and the growing tree.
    - Toggle "Ambiyans" sounds like Rain if you need background noise.
5.  **Complete & Log**: When the timer ends, a modal will appear. Enter a note about what you accomplished.
6.  **Take a Break**: Enjoy your short or long break before the next session.
7.  **Review History**: Click the **History** icon to see your past productivity logs.

## 🎨 Themes

You can customize the look and feel in the Settings menu.
- **Default**: Premium dark mode with gradients.
- **Minimal**: Distraction-free light mode.
- **Cyberpunk**: High-contrast neon aesthetics.
- **Pastel**: Calming, soft colors.

## 📄 License

This project is open source and available under the MIT License.
