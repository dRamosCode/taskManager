import '@mantine/core/styles.css'
import {
  useMantineColorScheme,
  Tabs,
  TextInput,
  ActionIcon,
  Group,
  Text,
  Button,
  Stack,
  Paper,
  Box,
  SimpleGrid,
  Center,
  NumberInput,
  Modal,
  Badge
} from '@mantine/core'
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlus,
  IconTrash,
  IconClock,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconPencil,
  IconMinus,
  IconX,
  IconSun,
  IconMoon
} from '@tabler/icons-react'
import { useState, useEffect, useMemo } from 'react'

type TaskCategory = 'work' | 'personal' | 'health' | 'meeting' | 'other'

interface Task {
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

const categoryColors: Record<TaskCategory, string> = {
  work: '#20C997',
  personal: '#748FFC',
  health: '#FF6B6B',
  meeting: '#FFE66D',
  other: '#868e96'
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

function parseTimeToMs(hours: number, minutes: number, seconds: number): number {
  return (hours * 3600 + minutes * 60 + seconds) * 1000
}

function msToComponents(ms: number): { hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.floor(ms / 1000)
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  }
}

function getRandomColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.floor(Math.random() * 30) // 70-100%
  const lightness = 30 + Math.floor(Math.random() * 20) // 30-50% for good contrast with white text
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

const darkColors = {
  bg: '#0F0F12',
  bgSecondary: '#18181D',
  bgTertiary: '#1F1F26',
  surface: '#1A1A22',
  surfaceElevated: '#24242E',
  border: '#2E2E3A',
  borderLight: '#3D3D4A',
  text: '#E9ECEF',
  textMuted: '#909296',
  textDim: '#5C5F66',
  accent: '#20C997',
  accentHover: '#12B886',
  danger: '#FF6B6B',
  warning: '#FFE66D'
}

const lightColors = {
  bg: '#F8F9FA',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F1F3F5',
  surface: '#FFFFFF',
  surfaceElevated: '#FAFAFA',
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  text: '#212529',
  textMuted: '#6C757D',
  textDim: '#ADB5BD',
  accent: '#12B886',
  accentHover: '#0CA678',
  danger: '#FA5252',
  warning: '#FAB005'
}

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [, setCurrentTime] = useState(Date.now())
  const [calendarDate, setCalendarDate] = useState(new Date())
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
          category: (t.category || 'work') as TaskCategory,
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

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks
    .filter((t) => t.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
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
        category: 'work' as TaskCategory,
        date: today,
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

  const renderTasks = (): React.JSX.Element => {
    return (
      <Stack gap="md" style={{ height: '100%' }}>
        <Paper
          p="md"
          radius="lg"
          style={{
            background: colors.bgSecondary,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <Group justify="space-between" mb="sm">
            <Text
              size="sm"
              c={colors.textMuted}
              tt="uppercase"
              fw={600}
              style={{ letterSpacing: '1px' }}
            >
              Active Tasks
            </Text>
            {runningTasks.length > 0 && (
              <Badge color="teal" variant="filled" size="sm">
                {runningTasks.length} running
              </Badge>
            )}
          </Group>
          {runningTasks.length > 0 ? (
            <Group gap="md" wrap="nowrap" style={{ overflowX: 'auto', paddingBottom: 4 }}>
              {runningTasks.map((task) => (
                <Paper
                  key={task.id}
                  p="sm"
                  radius="lg"
                  style={{
                    background: colors.surfaceElevated,
                    minWidth: 180,
                    flexShrink: 0,
                    borderLeft: `3px solid ${categoryColors[task.category]}`,
                    boxShadow: `0 0 20px ${categoryColors[task.category]}30`
                  }}
                >
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c={colors.textMuted}>
                        {task.project}
                      </Text>
                      <Text c={colors.text} fw={500} size="sm">
                        {task.name}
                      </Text>
                      <Text
                        c={colors.accent}
                        size="xs"
                        fw={600}
                        style={{ fontFamily: 'monospace' }}
                      >
                        {formatTime(getElapsedTime(task))}
                      </Text>
                    </div>
                    <ActionIcon
                      variant="light"
                      color="teal"
                      size="lg"
                      radius="xl"
                      onClick={() => toggleTask(task.id)}
                      style={{ boxShadow: `0 0 10px ${colors.accent}40` }}
                    >
                      <IconPlayerPause size={18} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Group>
          ) : (
            <Text c={colors.textDim} fs="italic" size="sm">
              No active tasks
            </Text>
          )}
        </Paper>

        <Stack gap="sm" className="no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          {todayTasks.map((task) => {
            const elapsed = getElapsedTime(task)
            const isEditing = editingTask === task.id
            const editTimeComponents = msToComponents(task.totalMs)
            return (
              <Paper
                key={task.id}
                p="md"
                radius="lg"
                style={{
                  borderLeft: `4px solid ${categoryColors[task.category]}`,
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.borderLight
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {isEditing ? (
                  <Group gap="md" align="flex-end">
                    <TextInput
                      label="Project"
                      value={task.project}
                      onChange={(e) => updateTask(task.id, { project: e.target.value })}
                      w={120}
                      styles={{
                        input: {
                          background: colors.bgSecondary,
                          borderColor: colors.border,
                          color: colors.text
                        }
                      }}
                    />
                    <TextInput
                      label="Name"
                      value={task.name}
                      onChange={(e) => updateTask(task.id, { name: e.target.value })}
                      style={{ flex: 1 }}
                      styles={{
                        input: {
                          background: colors.bgSecondary,
                          borderColor: colors.border,
                          color: colors.text
                        }
                      }}
                    />
                    <NumberInput
                      label="Hours"
                      value={editTimeComponents.hours}
                      onChange={(v) =>
                        updateTask(task.id, {
                          totalMs: parseTimeToMs(
                            Number(v) || 0,
                            editTimeComponents.minutes,
                            editTimeComponents.seconds
                          )
                        })
                      }
                      w={70}
                      min={0}
                      styles={{
                        input: {
                          background: colors.bgSecondary,
                          borderColor: colors.border,
                          color: colors.text
                        }
                      }}
                    />
                    <NumberInput
                      label="Min"
                      value={editTimeComponents.minutes}
                      onChange={(v) =>
                        updateTask(task.id, {
                          totalMs: parseTimeToMs(
                            editTimeComponents.hours,
                            Number(v) || 0,
                            editTimeComponents.seconds
                          )
                        })
                      }
                      w={70}
                      min={0}
                      max={59}
                      styles={{
                        input: {
                          background: colors.bgSecondary,
                          borderColor: colors.border,
                          color: colors.text
                        }
                      }}
                    />
                    <NumberInput
                      label="Sec"
                      value={editTimeComponents.seconds}
                      onChange={(v) =>
                        updateTask(task.id, {
                          totalMs: parseTimeToMs(
                            editTimeComponents.hours,
                            editTimeComponents.minutes,
                            Number(v) || 0
                          )
                        })
                      }
                      w={70}
                      min={0}
                      max={59}
                      styles={{
                        input: {
                          background: colors.bgSecondary,
                          borderColor: colors.border,
                          color: colors.text
                        }
                      }}
                    />
                    <Button color="teal" onClick={() => setEditingTask(null)}>
                      Save
                    </Button>
                  </Group>
                ) : (
                  <Group justify="space-between" style={{ flex: 1 }}>
                    <Group gap="lg" style={{ flex: 1 }}>
                      <Box style={{ minWidth: 80 }}>
                        <Text size="xs" c={colors.textMuted}>
                          {task.project}
                        </Text>
                        <Text fw={600} size="md" lineClamp={1} c={colors.text}>
                          {task.name}
                        </Text>
                      </Box>
                    </Group>
                    <Group gap="xs">
                      <Group gap="xs">
                        <IconClock size={16} style={{ opacity: 0.6, color: colors.textMuted }} />
                        <Text
                          size="lg"
                          fw={700}
                          ff="monospace"
                          c={task.isRunning ? colors.accent : colors.text}
                          style={{ marginRight: '2rem' }}
                        >
                          {formatTime(elapsed)}
                        </Text>
                      </Group>
                      <ActionIcon
                        variant={task.isRunning ? 'filled' : 'light'}
                        color={task.isRunning ? 'red' : 'teal'}
                        size="lg"
                        onClick={() => toggleTask(task.id)}
                        style={{ transition: 'all 0.2s' }}
                      >
                        {task.isRunning ? (
                          <IconPlayerPause size={18} />
                        ) : (
                          <IconPlayerPlay size={18} />
                        )}
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        c={colors.textMuted}
                        onClick={() => setEditingTask(task.id)}
                        style={{ transition: 'all 0.2s' }}
                      >
                        <IconPencil size={18} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        c={colors.danger}
                        onClick={() => deleteTask(task.id)}
                        style={{ transition: 'all 0.2s' }}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                )}
              </Paper>
            )
          })}

          {todayTasks.length === 0 && (
            <Center
              h={200}
              style={{
                background: colors.surface,
                borderRadius: 12,
                border: `1px dashed ${colors.border}`
              }}
            >
              <Stack align="center" gap="xs">
                <IconClock size={40} style={{ opacity: 0.3, color: colors.textMuted }} />
                <Text c={colors.textDim} size="md">
                  No tasks for today
                </Text>
                <Text c={colors.textMuted} size="sm">
                  Click &quot;Add Task&quot; to create one
                </Text>
              </Stack>
            </Center>
          )}
        </Stack>

        {showAddForm ? (
          <Paper
            p="md"
            radius="lg"
            style={{ background: colors.surface, border: `1px solid ${colors.border}` }}
          >
            <Group gap="md" align="flex-end">
              <TextInput
                label="Project"
                placeholder="PRJ-001"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                w={150}
                styles={{
                  input: {
                    background: colors.bgSecondary,
                    borderColor: colors.border,
                    color: colors.text
                  }
                }}
              />
              <TextInput
                label="Task Name"
                placeholder="Enter task name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addTask()
                }}
                style={{ flex: 1 }}
                styles={{
                  input: {
                    background: colors.bgSecondary,
                    borderColor: colors.border,
                    color: colors.text
                  }
                }}
              />
              <Button color="teal" onClick={addTask}>
                Add
              </Button>
              <Button variant="subtle" c={colors.textMuted} onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </Group>
          </Paper>
        ) : (
          <Button
            leftSection={<IconPlus size={18} />}
            variant="filled"
            color="teal"
            onClick={() => setShowAddForm(true)}
            size="md"
            style={{ transition: 'all 0.2s', boxShadow: `0 0 15px ${colors.accent}40` }}
          >
            Add Task
          </Button>
        )}
      </Stack>
    )
  }

  const getWeekDates = (
    centerDate: Date
  ): { date: string; day: number; dayName: string; isCenter: boolean; tasks: Task[] }[] => {
    const result: {
      date: string
      day: number
      dayName: string
      isCenter: boolean
      tasks: Task[]
    }[] = []
    const center = new Date(centerDate)

    for (let i = -3; i <= 3; i++) {
      const d = new Date(center)
      d.setDate(center.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      result.push({
        date: dateStr,
        day: d.getDate(),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        isCenter: i === 0,
        tasks: tasks
          .filter((t) => t.date === dateStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
      })
    }
    return result
  }

  const weekDates = useMemo(() => getWeekDates(calendarDate), [calendarDate, tasks])

  const renderCalendar = (): React.JSX.Element => (
    <Stack gap="lg" h="100%">
      <Group justify="space-between" align="center">
        <Group gap="md">
          <ActionIcon
            variant="subtle"
            c={colors.textMuted}
            onClick={() => {
              const newDate = new Date(calendarDate)
              newDate.setDate(newDate.getDate() - 7)
              setCalendarDate(newDate)
            }}
          >
            <IconChevronLeft size={18} />
          </ActionIcon>
          <Text size="sm" fw={500} w={100} ta="center" c={colors.text}>
            {calendarDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <input
            type="date"
            value={calendarDate.toISOString().split('T')[0]}
            onChange={(e) => e.target.value && setCalendarDate(new Date(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              fontSize: 12,
              background: colors.bgSecondary,
              color: colors.text,
              outline: 'none'
            }}
          />
          <ActionIcon
            variant="subtle"
            c={colors.textMuted}
            onClick={() => {
              const newDate = new Date(calendarDate)
              newDate.setDate(newDate.getDate() + 7)
              setCalendarDate(newDate)
            }}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
        <Button variant="light" color="teal" size="xs" onClick={() => setCalendarDate(new Date())}>
          Today
        </Button>
      </Group>

      <SimpleGrid cols={7} spacing="sm" style={{ flex: 1, overflow: 'hidden' }}>
        {weekDates.map(({ date, day, dayName, isCenter, tasks: dayTasks }) => (
          <Paper
            key={date}
            p="xs"
            radius="lg"
            style={{
              border: isCenter ? `2px solid ${colors.accent}` : `1px solid ${colors.border}`,
              background: isCenter ? `${colors.accent}10` : colors.surface,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 200,
              transition: 'all 0.2s',
              overflow: 'hidden'
            }}
          >
            <Stack gap={2} mb="xs">
              <Text size="xs" c={colors.textMuted} ta="center" tt="uppercase" fw={500}>
                {dayName}
              </Text>
              <Text
                size="lg"
                fw={isCenter ? 700 : 500}
                ta="center"
                c={isCenter ? colors.accent : colors.text}
              >
                {day}
              </Text>
            </Stack>
            <Stack
              gap="xs"
              style={{
                flex: 1,
                overflowY: 'scroll',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {dayTasks.length === 0 ? (
                <Text size="xs" c={colors.textDim} ta="center" fs="italic">
                  No tasks
                </Text>
              ) : (
                dayTasks.map((task) => (
                  <Paper
                    key={task.id}
                    p="xs"
                    radius="sm"
                    style={{
                      background: task.color,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      width: '100%'
                    }}
                    onClick={() => setSelectedTask(task)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Text c="white" size="xs" truncate fw={500}>
                      {task.project}
                    </Text>
                    <Text c="white" size="xs" truncate style={{ opacity: 0.8 }}>
                      {task.name}
                    </Text>
                    <Text c="white" size="xs" style={{ opacity: 0.8 }}>
                      {formatTime(getElapsedTime(task))}
                    </Text>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  )

  const dragStyle = { WebkitAppRegion: 'drag' } as React.CSSProperties
  const noDragStyle = { WebkitAppRegion: 'no-drag' } as React.CSSProperties

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
        <Box
          style={{
            background: colors.bgSecondary,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            justifyContent: 'space-between'
          }}
        >
          <Box
            style={{
              ...dragStyle,
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              cursor: 'default',
              flex: 1
            }}
          >
            <Group gap={6}>
              <Box w={6} h={20} style={{ background: colors.accent, borderRadius: 2 }} />
              <Text c={colors.text} size="sm" fw={600} style={{ letterSpacing: '0.5px' }}>
                TaskMgr
              </Text>
            </Group>
          </Box>

          <Tabs value={activeTab} onChange={(v) => setActiveTab(v || 'tasks')} variant="pills">
            <Tabs.List
              style={{
                background: colors.bgTertiary,
                borderRadius: 20,
                padding: 2,
                display: 'flex'
              }}
            >
              <Tabs.Tab
                value="tasks"
                leftSection={<IconClock size={16} />}
                style={{
                  background: activeTab === 'tasks' ? colors.accent : 'transparent',
                  color: activeTab === 'tasks' ? '#ffffff' : colors.textMuted,
                  borderRadius: '18px 0 0 18px',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Tasks
              </Tabs.Tab>
              <Tabs.Tab
                value="calendar"
                leftSection={<IconCalendar size={16} />}
                style={{
                  background: activeTab === 'calendar' ? colors.accent : 'transparent',
                  color: activeTab === 'calendar' ? '#ffffff' : colors.textMuted,
                  borderRadius: '0 18px 18px 0',
                  padding: '8px 16px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Calendar
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Group gap={8} style={{ ...dragStyle, flex: 1, justifyContent: 'flex-end' }}>
            <ActionIcon
              variant="subtle"
              c={colors.textMuted}
              size="sm"
              onClick={toggleColorScheme}
              style={{ transition: 'color 0.2s', ...noDragStyle }}
            >
              {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              c={colors.textMuted}
              size="sm"
              onClick={() => window.api?.minimizeWindow()}
              style={{ transition: 'color 0.2s', ...noDragStyle }}
            >
              <IconMinus size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              c={colors.textMuted}
              size="sm"
              onClick={() => window.api?.closeApp()}
              style={{ transition: 'color 0.2s', ...noDragStyle }}
            >
              <IconX size={16} />
            </ActionIcon>
          </Group>
        </Box>

        <Box style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'tasks' && (
            <Box
              p="lg"
              style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {renderTasks()}
            </Box>
          )}
          {activeTab === 'calendar' && (
            <Box p="lg" style={{ flex: 1, overflow: 'auto' }}>
              {renderCalendar()}
            </Box>
          )}
        </Box>
      </Box>

      <Modal
        opened={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.name || 'Task Details'}
        centered
        size="sm"
        // Change color depending on theme selected
        styles={{
          header: { background: colors.bgSecondary },
          body: { background: colors.bgSecondary }
        }}
      >
        {selectedTask && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Project
              </Text>
              <Badge style={{ backgroundColor: selectedTask.color }} c="white">
                {selectedTask.project}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Date
              </Text>
              <Text size="sm">
                {new Date(selectedTask.date).toLocaleDateString('en-UK', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Start Time
              </Text>
              <Text size="sm">{selectedTask.startTime}</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Total Time
              </Text>
              <Text size="sm" fw={700}>
                {formatTime(getElapsedTime(selectedTask))}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Status
              </Text>
              <Badge color={selectedTask.isRunning ? 'green' : 'gray'}>
                {selectedTask.isRunning ? 'Running' : 'Paused'}
              </Badge>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}

export default App
