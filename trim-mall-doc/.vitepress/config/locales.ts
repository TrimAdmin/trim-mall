import { LocaleConfig } from 'vitepress'
import { DefaultTheme } from 'vitepress/theme'
import { resolve } from 'path'
import * as fs from 'fs'

const locales: LocaleConfig<DefaultTheme.Config> = {
  root: {
    label: '简体中文',
    lang: 'zh-cn',
    link: '/'
  },
  en: {
    label: 'English',
    lang: 'en',
    link: '/en/'
  }
}

export default locales
