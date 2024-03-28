import { defineConfig } from 'vitepress'
import themeConfig from './config/theme'
import locales from './config/locales'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/docs/',
  title: 'Trim Mall',
  titleTemplate: 'Trim Mall文档',
  description: '多端多租户在线商城',
  srcDir: 'docs',
  cleanUrls: true,
  themeConfig,
  locales
})
