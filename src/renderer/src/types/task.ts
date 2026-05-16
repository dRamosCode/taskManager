export type TaskCategory = 'work' | 'personal' | 'health' | 'meeting' | 'other'

export interface Task {
  id: string
  project: string
  name: string
  category: TaskCategory
  date: string
  startTime: string
  totalMs: number
  isRunning: boolean
  startTimeActual?: Date
  color: string
}
