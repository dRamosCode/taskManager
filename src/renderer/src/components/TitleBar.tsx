import { Box, Group, Text, Tabs, ActionIcon } from '@mantine/core'
import { IconClock, IconCalendar, IconSun, IconMoon, IconMinus, IconX } from '@tabler/icons-react'
import type { ThemeColors } from '../utils/colorUtils'

interface TitleBarProps {
  colors: ThemeColors
  activeTab: string
  setActiveTab: (tab: string | null) => void
  colorScheme: 'dark' | 'light' | 'auto'
  toggleColorScheme: () => void
}

export function TitleBar({
  colors,
  activeTab,
  setActiveTab,
  colorScheme,
  toggleColorScheme
}: TitleBarProps): React.JSX.Element {
  const dragStyle = { WebkitAppRegion: 'drag' } as React.CSSProperties
  const noDragStyle = { WebkitAppRegion: 'no-drag' } as React.CSSProperties

  return (
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
  )
}
