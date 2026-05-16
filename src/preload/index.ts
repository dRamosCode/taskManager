import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

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

const api = {
  onToggleCurrentTask: (callback: () => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('toggle-current-task', handler)
    return () => ipcRenderer.removeListener('toggle-current-task', handler)
  },
  onShowTasksTab: (callback: () => void) => {
    const handler = (): void => callback()
    ipcRenderer.on('show-tasks-tab', handler)
    return () => ipcRenderer.removeListener('show-tasks-tab', handler)
  },
  loadTasks: (): Promise<Task[]> => ipcRenderer.invoke('load-tasks'),
  saveTasks: (tasks: Task[]) => ipcRenderer.send('save-tasks', tasks),
  minimizeWindow: (): void => ipcRenderer.send('minimize-window'),
  closeApp: (): void => ipcRenderer.send('close-app')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
