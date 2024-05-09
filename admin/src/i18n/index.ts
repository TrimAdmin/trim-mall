import { createI18n } from 'vue-i18n'
import { App } from 'vue'
import zhCN from './lang/zh-cn.json'
import enUS from './lang/en-us.json'
import useSettingsStore from '@/store/modules/settings'

export const i18n = createI18n({
  locale: useSettingsStore().i18n,
  fallbackLocale: 'zh-cn',
  legacy: false,
  messages: {
    'zh-cn': zhCN,
    'en-us': enUS
  }
})

function install(app: App) {
  app.use(i18n)
}

export default { install }
