import {
  Stack,
  Paper,
  Group,
  Text,
  TextInput,
  Button,
  ActionIcon,
  NumberInput,
  Badge,
  Center,
  Box
} from '@mantine/core'
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlus,
  IconTrash,
  IconClock,
  IconPencil
} from '@tabler/icons-react'
import type { Task } from '../types/task'
import { categoryColors, type ThemeColors } from '../utils/colorUtils'
import { formatTime, msToComponents, parseTimeToMs } from '../utils/timeUtils'

interface TaskListProps {
  tasks: Task[]
  runningTasks: Task[]
  colors: ThemeColors
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  addTask: () => void
  newProject: string
  setNewProject: (value: string) => void
  newName: string
  setNewName: (value: string) => void
  showAddForm: boolean
  setShowAddForm: (value: boolean) => void
  editingTask: string | null
  setEditingTask: (id: string | null) => void
}

export function TaskList({
  tasks,
  runningTasks,
  colors,
  toggleTask,
  deleteTask,
  updateTask,
  addTask,
  newProject,
  setNewProject,
  newName,
  setNewName,
  showAddForm,
  setShowAddForm,
  editingTask,
  setEditingTask
}: TaskListProps): React.JSX.Element {
  const today = new Date().toISOString().split('T')[0]
  const todayTasks = tasks
    .filter((t) => t.date === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const getElapsedTime = (task: Task): number => {
    if (!task.isRunning || !task.startTimeActual) return task.totalMs
    return task.totalMs + (Date.now() - task.startTimeActual.getTime())
  }

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
                    <Text c={colors.accent} size="xs" fw={600} style={{ fontFamily: 'monospace' }}>
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
