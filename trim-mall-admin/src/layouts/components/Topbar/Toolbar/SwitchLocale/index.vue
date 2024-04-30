<script setup lang="ts">
import { useSettingsStore } from '@/store/modules/settings'
import { I18n } from '#/global'

function handleLocale(locale: I18n) {
  useSettingsStore().setI18n(locale)
}

const locales = [
  { label: '简体中文', value: 'zh-cn', icon: 'i-ri:pinyin-input' },
  { label: 'English', value: 'en-us', icon: 'i-ri:english-input' }
]
</script>

<template>
  <el-dropdown @command="handleLocale">
    <div class="flex-center cursor-pointer px-2 text-4">
      <SvgIcon name="i-ri:translate" />
    </div>
    <template #dropdown>
      <el-dropdown-item
        v-for="locale in locales"
        :key="locale.value"
        :command="locale.value"
        :disabled="usePersistedSettingsStore().i18n === locale.value"
      >
        <SvgIcon :name="locale.icon" />
        {{ locale.label }}
      </el-dropdown-item>
    </template>
  </el-dropdown>
</template>

<style scoped lang="scss"></style>
