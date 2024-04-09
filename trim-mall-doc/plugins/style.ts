import type { RspressPlugin } from '@rspress/shared'
import path from 'path'

export function pluginStyle(): RspressPlugin {
  return {
    name: 'plugin-style',
    globalStyles: path.join(__dirname, '../style/global.css')
  }
}
