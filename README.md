# Premium Pomodoro App 🍅

A modern, feature-rich Pomodoro timer application built with React, TypeScript, and Vite. Designed to boost productivity with a premium aesthetic, gamification elements, and robust session tracking.

<img width="1728" height="1026" alt="Screenshot 2025-12-07 at 15 07 29" src="https://github.com/user-attachments/assets/3255f71e-3ebf-48dc-8dc1-276e5a7b4504" />


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
  - Cyberpunk (Neon Green/Black)
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
- **Cyberpunk**: High-contrast neon aesthetics.

## � Mobile App (React Native)

This project has been ported to React Native for iOS and Android. The native code is located in the `pomodoro-native` directory.

### Prerequisites

- **Node.js** installed.
- **Expo Go** app installed on your smartphone (available on App Store and Play Store).

### Running on Mobile (Physical Device)

1.  **Navigate to the native project directory:**
    ```bash
    cd pomodoro-native
    ```

2.  **Install dependencies (if not already done):**
    ```bash
    npm install
    ```

3.  **Start the Expo Development Server:**
    ```bash
    npx expo start
    ```
    This will generate a QR code in your terminal.

4.  **Connect your phone:**
    - **Android:** Open Expo Go app and scan the QR code.
    - **iOS:** Open the Camera app and scan the QR code.

### 🔌 USB Debugging (Android)

If you have connectivity issues or prefer a faster connection:

1.  **Enable Developer Options** on your Android phone (Settings > About Phone > Tap "Build Number" 7 times).
2.  **Enable USB Debugging** in Developer Options.
3.  Connect your phone to your computer via USB.
4.  Run the app with:
    ```bash
    npx expo start --android
    ```
    *If you get connection errors, ensure your computer is **Authorized** on your phone screen when you plug it in.*

### ⚠️ Troubleshooting Connection

If the app gets stuck on "Loading..." or cannot connect:

1.  **Same Network:** Ensure your phone and computer are on the exact same Wi-Fi network.
2.  **Firewall:** Your firewall might be blocking the connection.
3.  **Use Tunnel Mode:** If local connection fails, use ngrok tunnel (slower but works everywhere):
    ```bash
    npx expo start --tunnel
    ```

## �📄 License

This project is open source and available under the MIT License.
