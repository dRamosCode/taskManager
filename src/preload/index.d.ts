import { ElectronAPI } from '@electron-toolkit/preload'

interface Task {
  id: string
  project: string
  name: string
  category: string
  date: string
  startTime: string
  totalMs: number
  isRunning: boolean
  startTimeActual?: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onToggleCurrentTask: (callback: () => void) => () => void
      onShowTasksTab: (callback: () => void) => () => void
      loadTasks: () => Promise<Task[]>
      saveTasks: (tasks: Task[]) => void
      minimizeWindow: () => void
      closeApp: () => void
    }
  }
}
