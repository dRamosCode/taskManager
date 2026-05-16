<p align="center" > 
<img src="https://github.com/dRamosCode/taskManager/blob/f6bcf806b25eb19460cba5b9f0e462794d8df71e/resources/icon.png?raw=true"></img></p>
<h1 align="center">
TaskManager
</h1>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/dRamosCode/taskmanager?label=Version
  " alt="Version">
  <img src="https://img.shields.io/github/last-commit/dRamosCode/taskmanager?label=Last%20commit" alt="Last commit">
  <img src="https://img.shields.io/github/downloads/dRamosCode/taskmanager/total
  ?label=Downloads" alt="Downloads">
    <img src="https://img.shields.io/github/license/dRamosCode/taskmanager?label=License" alt="License">
</p>

A desktop task manager with time tracking, calendar view, and system tray integration built with Electron, React, and TypeScript.

## Features

- **Task Management**: Create, edit, and delete tasks with project organization
- **Time Tracking**: Start/pause timers for each task with real-time updates
- **Task Categories**: Organize tasks by category (work, personal, health, meeting, other)
- **Calendar View**: Weekly calendar view showing tasks per day with navigation
- **Dark/Light Theme**: Toggle between dark and light color schemes
- **System Tray**: Runs in system tray with quick access menu
- **Global Shortcuts**:
  - `Ctrl+Shift+T` - Show TaskManager and switch to Tasks tab
  - `Ctrl+Shift+Q` - Quit application
- **Persistent Storage**: Tasks are automatically saved to local JSON file

## Requirements

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

The installer will be created in the `dist/` directory.

## Tech Stack

- Electron 38
- React 19
- TypeScript 5.9
- Mantine UI 8
- Vite 7
- electron-vite

## Data Location

Task data is stored in the user's app data directory:

- Windows: `%APPDATA%\TaskManager\data.json`
- macOS: `~/Library/Application Support/TaskManager/data.json`
- Linux: `~/.config/TaskManager/data.json`
