import { useState } from 'react'
import { Box, Group, Text, SegmentedControl, SimpleGrid, Stack, Paper } from '@mantine/core'
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconCalendarWeek,
  IconCalendarMonth
} from '@tabler/icons-react'
import { Task, categoryColors } from '../../hooks/useTasks'

type ViewMode = 'day' | 'week' | 'month'

interface CalendarProps {
  tasks: Task[]
}

export function Calendar({ tasks }: CalendarProps): React.JSX.Element {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDates = (): string[] => {
    const dates: string[] = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const day = currentDate.getDate()

    if (viewMode === 'day') {
      const date = new Date(year, month, day)
      dates.push(date.toISOString().split('T')[0])
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(year, month, day - ((day + 6) % 7))
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        dates.push(d.toISOString().split('T')[0])
      }
    } else {
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(year, month, i)
        dates.push(d.toISOString().split('T')[0])
      }
    }
    return dates
  }

  const navigate = (direction: number): void => {
    const newDate = new Date(currentDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7)
    } else {
      newDate.setMonth(newDate.getMonth() + direction)
    }
    setCurrentDate(newDate)
  }

  const getTitle = (): string => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    } else if (viewMode === 'week') {
      const start = new Date(currentDate)
      start.setDate(start.getDate() - ((start.getDate() + 6) % 7))
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    }
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const getTasksForDate = (date: string): Task[] => {
    return tasks
      .filter((t) => t.date === date)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const dates = getDates()
  return <></>
  return (
    <Stack gap="md" h="100%">
      <Group justify="space-between" align="center">
        <Group>
          <IconChevronLeft style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} />
          <Text size="lg" fw={600} w={200} ta="center">{getTitle()}</Text>
          <IconChevronRight style={{ cursor: 'pointer' }} onClick={() => navigate(1)} />
        </Group>
        <SegmentedControl
          value={viewMode}
          onChange={(v) => setViewMode(v as ViewMode)}
          data={[
            { label: <Group gap={4}><IconCalendar size={14} /> Day</Group>, value: 'day' },
            { label: <Group gap={4}><IconCalendarWeek size={14} /> Week</Group>, value: 'week' },
            { label: <Group gap={4}><IconCalendarMonth size={14} /> Month</Group>, value: 'month' },
          ]}
        />
      </Group>

      <SimpleGrid cols={7} spacing="xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <Text key={d} size="sm" fw={500} ta="center" c="dimmed">{d}</Text>
        ))}
        {dates.map(date => {
          const dayTasks = getTasksForDate(date)
          const isToday = date === new Date().toISOString().split('T')[0]
          return (
            <Paper
              key={date}
              p="xs"
              h={100}
              style={{
                border: isToday ? '2px solid #E3735C' : '1px solid var(--mantine-color-gray-3)',
                background: isToday ? 'rgba(227, 115, 92, 0.1)' : undefined,
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              <Text size="sm" fw={isToday ? 700 : 400} mb={4}>{new Date(date).getDate()}</Text>
              <Stack gap={2} style={{ flex: 1, paddingRight: 2 }}>
                {dayTasks.slice(0, 3).map(task => (
                  <Box
                    key={task.id}
                    style={{
                      background: categoryColors[task.category],
                      borderRadius: 2,
                      padding: '4px 6px',
                      fontSize: 10,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Text c="white" size="xs" truncate>{task.title}</Text>
                  </Box>
                ))}
                {dayTasks.length > 3 && (
                  <Text size="xs" c="dimmed">+{dayTasks.length - 3} more</Text>
                )}
              </Stack>
            </Paper>
          )
        })}
      </SimpleGrid>

    </Stack >
  )
}