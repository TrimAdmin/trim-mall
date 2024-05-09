import type { Theme } from 'unocss/preset-uno'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerCompileClass,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'
import presetLegacyCompat from '@unocss/preset-legacy-compat'
import { entriesToCss, toArray } from '@unocss/core'
import { darkTheme, lightTheme } from './themes'

export default defineConfig<Theme>({
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/, 'src/**/*.{js,ts}']
    }
  },
  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'flex-col-center': 'flex flex-col justify-center items-center'
    }
  ],
  preflights: [
    {
      getCSS: () => {
        const returnCss: any = []
        // 明亮主题
        const lightCss = entriesToCss(Object.entries(lightTheme))
        const lightRoots = toArray([`*,::before,::after`, `::backdrop`])
        returnCss.push(lightRoots.map((root) => `${root}{${lightCss}}`).join(''))
        // 暗黑主题
        const darkCss = entriesToCss(Object.entries(darkTheme))
        const darkRoots = toArray([
          `html.dark,html.dark *,html.dark ::before,html.dark ::after`,
          `html.dark ::backdrop`
        ])
        returnCss.push(darkRoots.map((root) => `${root}{${darkCss}}`).join(''))

        return returnCss.join('')
      }
    }
  ],
  theme: {
    colors: {
      'ui-primary': 'var(--el-color-primary)',
      'ui-primary-light-3': 'var(--el-color-primary-light-3)',
      'ui-primary-light-5': 'var(--el-color-primary-light-5)',
      'ui-primary-light-7': 'var(--el-color-primary-light-7)',
      'ui-primary-light-8': 'var(--el-color-primary-light-8)',
      'ui-primary-light-9': 'var(--el-color-primary-light-9)',
      'ui-primary-dark-2': 'var(--el-color-primary-dark-2)',
      'ui-text': 'var(--el-text-color-primary)',
      'ui-text-regular': 'var(--el-text-color-regular)',
      'ui-text-secondary': 'var(--el-text-color-secondary)',
      'ui-text-placeholder': 'var(--el-text-color-placeholder)',
      'ui-text-disabled': 'var(--el-text-color-disabled)',
      'ui-border': 'var(--el-border-color)',
      'ui-border-light': 'var(--el-border-color-light)',
      'ui-border-lighter': 'var(--el-border-color-lighter)',
      'ui-border-extra-light': 'var(--el-border-color-extra-light)',
      'ui-border-dark': 'var(--el-border-color-dark)',
      'ui-border-darker': 'var(--el-border-color-darker)',
      'ui-fill': 'var(--el-fill-color)',
      'ui-fill-light': 'var(--el-fill-color-light)',
      'ui-fill-lighter': 'var(--el-fill-color-lighter)',
      'ui-fill-extra-light': 'var(--el-fill-color-extra-light)',
      'ui-fill-dark': 'var(--el-fill-color-dark)',
      'ui-fill-darker': 'var(--el-border-fill-darker)',
      'ui-fill-blank': 'var(--el-border-fill-blank)',
      'ui-bg': 'var(--el-bg-color)',
      'ui-bg-page': 'var(--el-bg-color-page)',
      'ui-bg-overlay': 'var(--el-bg-color-overlay)'
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle'
      }
    }),
    presetTypography(),
    // @@ts-expect-error
    presetLegacyCompat({
      commaStyleColorFunction: true
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup(), transformerCompileClass()],
  configDeps: ['themes/index.ts']
})
