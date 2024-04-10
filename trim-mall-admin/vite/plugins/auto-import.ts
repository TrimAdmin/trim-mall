import autoImport from 'unplugin-auto-import/vite'

export default function createAutoImport() {
  return autoImport({
    imports: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
    dts: './src/types/auto-imports.d.ts',
    dirs: ['./src/utils/composables/**']
  })
}
