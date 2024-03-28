import { DefaultTheme } from 'vitepress/theme'

const themeConfig: DefaultTheme.Config = {
  // https://vitepress.dev/reference/default-theme-config
  footer: {
    message: '基于MIT协议开源发布',
    copyright: 'Copyright © 2024-present ducheng1'
  },
  nav: [
    { text: 'Home', link: '' },
    { text: 'Examples', link: 'markdown-examples' }
  ],

  sidebar: [
    {
      text: 'Examples',
      items: [
        { text: 'Markdown Examples', link: 'markdown-examples' },
        { text: 'Runtime API Examples', link: 'api-examples' }
      ]
    }
  ],

  socialLinks: [{ icon: 'github', link: 'https://github.com/TrimAdmin/trim-mall' }]
}

export default themeConfig
