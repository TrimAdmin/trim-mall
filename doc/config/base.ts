import type { UserConfig } from '@rspress/shared'
import path from 'path'

export const base: UserConfig = {
  root: path.join(__dirname, '../docs'),
  title: 'Trim Mall',
  description: '全新的多端商城',
  icon: '/logo.png',
  logo: {
    light: '/logo.png',
    dark: '/logo.png'
  },
  logoText: 'Trim Mall'
}
