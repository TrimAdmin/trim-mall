import { UserConfig } from '@rspress/shared'

export const themeConfig: UserConfig['themeConfig'] = {
  socialLinks: [
    {
      icon: 'github',
      mode: 'link',
      content: 'https://github.com/TrimAdmin/trim-mall'
    }
  ],
  prevPageText: '上一页',
  nextPageText: '下一页',
  footer: {
    message: `Copyright © 2024-present TrimAdmin`
  }
}
