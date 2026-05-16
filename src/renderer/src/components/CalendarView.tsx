import { useState, useMemo } from 'react'
import { Stack, Group, Text, ActionIcon, Button, SimpleGrid, Paper } from '@mantine/core'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { Task } from '../types/task'
import type { ThemeColors } from '../utils/colorUtils'
import { formatTime } from '../utils/timeUtils'

interface CalendarViewProps {
  tasks: Task[]
  colors: ThemeColors
  setSelectedTask: (task: Task | null) => void
}

export function CalendarView({
  tasks,
  colors,
  setSelectedTask
}: CalendarViewProps): React.JSX.Element {
  const [calendarDate, setCalendarDate] = useState(new Date())

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

  const getElapsedTime = (task: Task): number => {
    if (!task.isRunning || !task.startTimeActual) return task.totalMs
    return task.totalMs + (Date.now() - task.startTimeActual.getTime())
  }

  return (
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
}
