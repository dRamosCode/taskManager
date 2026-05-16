import type { TaskCategory } from '../types/task'

export const categoryColors: Record<TaskCategory, string> = {
  work: '#20C997',
  personal: '#748FFC',
  health: '#FF6B6B',
  meeting: '#FFE66D',
  other: '#868e96'
}

export function getRandomColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 70 + Math.floor(Math.random() * 30)
  const lightness = 30 + Math.floor(Math.random() * 20)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const darkColors = {
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

export const lightColors = {
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

export type ThemeColors = typeof darkColors
