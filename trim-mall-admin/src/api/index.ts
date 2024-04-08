import axios from 'axios'

import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'

const api = axios.create({
  baseURL:
    import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY === 'true'
      ? '/proxy/'
      : import.meta.env.VITE_APP_API_BASEURL,
  timeout: 1000 * 60,
  responseType: 'json',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use((request) => {
  // 全局拦截请求发送前提交的参数
  const userStore = useUserStore()
  // 设置请求头
  if (request.headers) {
    if (userStore.isLogin) {
      request.headers.Token = userStore.token
    }
  }
  return request
})

api.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data)
  },
  (error) => {
    const { code, message } = error.response.data
    switch (code) {
      case 400:
        ElMessage.error(message)
        break
      case 401:
        ElMessage.error(message)
        useUserStore().logout()
        break
      case 404:
        ElMessage.error('请求接口不存在')
        break
    }
  }
)

export default api
