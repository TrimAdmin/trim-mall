import { defaultsDeep } from 'lodash'
import type { RecursiveRequired, Settings } from '#/global'
import settingsDefault from '@/settings.default'

const globalSettings: Settings.all = {
  app: {
    enablePermission: true,
    enableDynamicTitle: true,
    colorScheme: 'light',
    routeBaseOn: 'frontend'
  },
  menu: {
    enableSubMenuCollapseButton: true,
    switchMainMenuAndPageJump: true,
    baseOn: 'frontend',
    menuMode: 'side'
  },
  topbar: {
    mode: 'fixed'
  },
  tabbar: {
    enable: true,
    enableIcon: true
  },
  toolbar: {
    fullscreen: true,
    pageReload: true,
    colorScheme: true
  },
  copyright: {
    enable: true,
    dates: '2024-present',
    company: 'TrimAdmin'
  }
}

export default defaultsDeep(globalSettings, settingsDefault) as RecursiveRequired<Settings.all>
