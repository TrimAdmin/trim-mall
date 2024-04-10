const usePersistSettings = defineStore(
  'persist-settings',
  () => {
    // 国际化语言
    const i18n = ref<string>('zh-cn')

    return {
      i18n
    }
  },
  {
    persist: {
      key: 'trim__settings',
      storage: localStorage
    }
  }
)
