import { ConfigEnv, loadEnv, UserConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'

import path from 'path'

const CWD = process.cwd()

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL } = loadEnv(mode, CWD)
  return {
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: 7299,
      // 代理api
      proxy: {
        '/proxyApi': {
          target: loadEnv(mode, process.cwd()).VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxyApi/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`
          },
          math: 'strict',
          javascriptEnabled: true
        }
      }
    },

    plugins: [createVuePlugin(), vueJsx(), svgLoader()]
  }
}
