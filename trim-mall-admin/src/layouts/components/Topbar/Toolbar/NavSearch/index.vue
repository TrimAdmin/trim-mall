<script setup lang="ts">
import eventBus from '@/utils/eventBus'
import useSettingsStore from '@/store/modules/settings'

defineOptions({
  name: 'ToolbarRightSide'
})

const settingsStore = useSettingsStore()
</script>

<template>
  <span class="flex-center cursor-pointer px-2 py-1" @click="eventBus.emit('global-search-toggle')">
    <SvgIcon v-if="settingsStore.mode === 'mobile'" name="i-ri:search-line" />
    <span
      v-else
      class="group inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-2 bg-ui-fill-light px-2 py-1.5 text-ui-text-placeholder ring-ui-primary-light-3 ring-inset transition hover:ring-1"
    >
      <SvgIcon name="i-ri:search-line" />
      <span class="text-sm text-ui-text-secondary transition group-hover:text-ui-primary dark:group-hover:text-white">
        搜索
      </span>
      <HKbd v-if="settingsStore.settings.navSearch.enableHotkeys" class="ml-2">
        {{ settingsStore.os === 'mac' ? '⌥' : 'Alt' }} S
      </HKbd>
    </span>
  </span>
</template>
