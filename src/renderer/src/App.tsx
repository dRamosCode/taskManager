import '@mantine/core/styles.css'
import { useState, useEffect, useMemo } from 'react'
import { Box } from '@mantine/core'
import { useMantineColorScheme } from '@mantine/core'
import type { Task } from './types/task'
import { getRandomColor, darkColors, lightColors } from './utils/colorUtils'
import { TitleBar } from './components/TitleBar'
import { TaskList } from './components/TaskList'
import { CalendarView } from './components/CalendarView'
import { TaskModal } from './components/TaskModal'

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [, setCurrentTime] = useState(Date.now())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const [newProject, setNewProject] = useState('')
  const [newName, setNewName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)

  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const colors = useMemo(() => (colorScheme === 'dark' ? darkColors : lightColors), [colorScheme])

  const defaultTasks: Task[] = [
    {
      id: '1',
      project: 'PROJECT',
      name: 'Welcome Task',
      category: 'work',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      totalMs: 0,
      isRunning: false,
      color: getRandomColor()
    }
  ]

  useEffect(() => {
    const loadTasks = async (): Promise<void> => {
      const savedTasks = await window.api?.loadTasks()
      if (savedTasks && savedTasks.length > 0) {
        const parsedTasks: Task[] = (
          savedTasks as Array<{
            id: string
            project: string
            name: string
            category?: string
            date: string
            startTime: string
            totalMs: number
            isRunning: boolean
            startTimeActual?: string
            color?: string
          }>
        ).map((t) => ({
          id: t.id,
          project: t.project,
          name: t.name,
          category: (t.category || 'work') as Task['category'],
          date: t.date,
          startTime: t.startTime,
          totalMs: t.totalMs,
          isRunning: t.isRunning,
          startTimeActual: t.startTimeActual ? new Date(t.startTimeActual) : undefined,
          color: t.color || getRandomColor()
        }))
        setTasks(parsedTasks)
      } else {
        setTasks(defaultTasks)
      }
    }
    loadTasks()
  }, [])

  useEffect(() => {
    const unsubscribe = window.api?.onShowTasksTab(() => {
      setActiveTab('tasks')
    })
    return () => {
      unsubscribe?.()
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (tasks.length > 0) {
      window.api?.saveTasks(
        tasks.map((t) => ({
          ...t,
          startTimeActual: t.startTimeActual?.toISOString()
        }))
      )
    }
  }, [tasks])

  const runningTasks = tasks.filter((t) => t.isRunning)

  const toggleTask = (id: string): void => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const isRunning = !task.isRunning
          if (!isRunning && task.startTimeActual) {
            const elapsedMs = Date.now() - task.startTimeActual.getTime()
            return {
              ...task,
              isRunning: false,
              totalMs: task.totalMs + elapsedMs,
              startTimeActual: undefined
            }
          }
          return {
            ...task,
            isRunning,
            startTimeActual: isRunning ? new Date() : undefined
          }
        }
        return task
      })
    )
  }

  const addTask = (): void => {
    if (!newProject.trim() || !newName.trim()) return
    const now = new Date()
    const startTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const id = Date.now().toString()
    setTasks((prev) => [
      ...prev,
      {
        id,
        project: newProject,
        name: newName,
        category: 'work',
        date: new Date().toISOString().split('T')[0],
        startTime,
        totalMs: 0,
        isRunning: false,
        color: getRandomColor()
      }
    ])
    toggleTask(id)
    setNewProject('')
    setNewName('')
    setShowAddForm(false)
  }

  const deleteTask = (id: string): void => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const updateTask = (id: string, updates: Partial<Task>): void => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const getElapsedTime = (task: Task): number => {
    if (!task.isRunning || !task.startTimeActual) return task.totalMs
    return task.totalMs + (Date.now() - task.startTimeActual.getTime())
  }

  return (
    <>
      <Box
        style={{
          height: '100vh',
          background: colors.bg,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TitleBar
          colors={colors}
          activeTab={activeTab}
          setActiveTab={(tab) => setActiveTab(tab || 'tasks')}
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        />

        <Box style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'tasks' && (
            <Box
              p="lg"
              style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              <TaskList
                tasks={tasks}
                runningTasks={runningTasks}
                colors={colors}
                toggleTask={toggleTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                addTask={addTask}
                newProject={newProject}
                setNewProject={setNewProject}
                newName={newName}
                setNewName={setNewName}
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
              />
            </Box>
          )}
          {activeTab === 'calendar' && (
            <Box p="lg" style={{ flex: 1, overflow: 'auto' }}>
              <CalendarView tasks={tasks} colors={colors} setSelectedTask={setSelectedTask} />
            </Box>
          )}
        </Box>
      </Box>

      <TaskModal
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        colors={colors}
        getElapsedTime={getElapsedTime}
      />
    </>
  )
}

export default App
