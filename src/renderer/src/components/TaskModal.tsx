import { Modal, Stack, Group, Text, Badge } from '@mantine/core'
import type { Task } from '../types/task'
import { type ThemeColors } from '../utils/colorUtils'
import { formatTime } from '../utils/timeUtils'

interface TaskModalProps {
  selectedTask: Task | null
  setSelectedTask: (task: Task | null) => void
  colors: ThemeColors
  getElapsedTime: (task: Task) => number
}

export function TaskModal({
  selectedTask,
  setSelectedTask,
  colors,
  getElapsedTime
}: TaskModalProps): React.JSX.Element {
  return (
    <Modal
      opened={!!selectedTask}
      onClose={() => setSelectedTask(null)}
      title={selectedTask?.name || 'Task Details'}
      centered
      size="sm"
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
  )
}
