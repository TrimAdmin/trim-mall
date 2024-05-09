import * as path from 'path'
import { defineConfig } from 'rspress/config'
import { base, plugins, themeConfig } from './config'

export default defineConfig({
  ...base,
  themeConfig,
  plugins
})
