import { useState, useCallback } from 'react'

export type TaskCategory = 'work' | 'personal' | 'health' | 'meeting' | 'other'

export interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  date: string
  startTime: string
  duration: number
  isRunning: boolean
  startTimeActual?: Date
}

export const categoryColors: Record<TaskCategory, string> = {
  work: '#E3735C',
  personal: '#5C9CE3',
  health: '#5CE3A1',
  meeting: '#E3A85C',
  other: '#9E9E9E'
}

const sampleTasks: Task[] = [
  { id: '1', title: 'Review PR #42', description: 'Code review for authentication refactor', category: 'work', date: '2026-05-03', startTime: '09:00', duration: 60, isRunning: false },
  { id: '2', title: 'Team Standup', description: 'Daily sync with the team', category: 'meeting', date: '2026-05-03', startTime: '10:00', duration: 30, isRunning: true, startTimeActual: new Date() },
  { id: '3', title: 'Fix Bug #128', description: 'Login issue on mobile devices', category: 'work', date: '2026-05-03', startTime: '11:00', duration: 120, isRunning: false },
  { id: '4', title: 'Gym Session', description: 'Workout and cardio', category: 'health', date: '2026-05-03', startTime: '14:00', duration: 90, isRunning: false },
  { id: '5', title: 'Write Documentation', description: 'Update API docs', category: 'work', date: '2026-05-03', startTime: '16:00', duration: 60, isRunning: false },
  { id: '6', title: 'Personal Planning', description: 'Weekly planning', category: 'personal', date: '2026-05-04', startTime: '09:00', duration: 45, isRunning: false },
  { id: '7', title: 'Client Call', description: 'Discuss project requirements', category: 'meeting', date: '2026-05-04', startTime: '11:00', duration: 60, isRunning: false },
  { id: '8', title: 'Yoga Session', description: 'Morning yoga', category: 'health', date: '2026-05-04', startTime: '07:00', duration: 45, isRunning: false },
  { id: '9', title: 'Code Review', description: 'Review team PRs', category: 'work', date: '2026-05-05', startTime: '10:00', duration: 90, isRunning: false },
  { id: '10', title: 'Project Planning', description: 'Sprint planning', category: 'meeting', date: '2026-05-05', startTime: '14:00', duration: 120, isRunning: false },
]

export function useTasks(): {
  tasks: Task[]
  toggleTask: (id: string) => void
  getRunningTasks: () => Task[]
  getTasksByDate: (date: string) => Task[]
  getTasksByDateRange: (startDate: string, endDate: string) => Task[]
  getTasksByCategory: (category: TaskCategory) => Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
} {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const isRunning = !task.isRunning
        return {
          ...task,
          isRunning,
          startTimeActual: isRunning ? new Date() : task.startTimeActual
        }
      }
      return task
    }))
  }, [])

  const getRunningTasks = useCallback(() => {
    return tasks.filter(t => t.isRunning)
  }, [tasks])

  const getTasksByDate = useCallback((date: string) => {
    return tasks.filter(t => t.date === date)
  }, [tasks])

  const getTasksByDateRange = useCallback((startDate: string, endDate: string) => {
    return tasks.filter(t => t.date >= startDate && t.date <= endDate)
  }, [tasks])

  const getTasksByCategory = useCallback((category: TaskCategory) => {
    return tasks.filter(t => t.category === category)
  }, [tasks])

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const id = Date.now().toString()
    setTasks(prev => [...prev, { ...task, id }])
  }, [])

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    tasks,
    toggleTask,
    getRunningTasks,
    getTasksByDate,
    getTasksByDateRange,
    getTasksByCategory,
    addTask,
    updateTask,
    deleteTask
  }
}