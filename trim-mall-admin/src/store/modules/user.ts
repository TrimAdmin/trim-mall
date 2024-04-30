import useSettingsStore from './settings'
import useRouteStore from './route'
import useMenuStore from './menu'
import router from '@/router'
import apiUser from '@/api/modules/user'
import { UserInfo } from '#/system/user'

const useUserStore = defineStore(
  // 唯一ID
  'user',
  () => {
    const settingsStore = useSettingsStore()
    const routeStore = useRouteStore()
    const menuStore = useMenuStore()

    const token = useLocalStorage<string>('trim__token', '')
    const permissions = ref<string[]>([])
    const isLogin = useLocalStorage<boolean>('trim__is-login', false)

    // 登录
    async function login(data: { username: string; password: string }) {
      const res = await apiUser.login(data)
      token.value = res.data
      isLogin.value = true
      router.push(((router.currentRoute.value.query && router.currentRoute.value.query.redirect) as string) ?? '/')
      await getUserInfo()
    }

    const userInfo = ref<UserInfo>({} as UserInfo)

    // 获取用户信息
    async function getUserInfo() {
      try {
        const { data } = await apiUser.getUserInfo()
        userInfo.value = data
      } catch (e) {
        // ignore empty block
      }
    }

    // 登出
    async function logout(redirect = router.currentRoute.value.fullPath) {
      token.value = ''
      permissions.value = []
      routeStore.removeRoutes()
      menuStore.setActived(0)
      isLogin.value = false
      router.push({
        name: 'login',
        query: {
          ...(router.currentRoute.value.path !== settingsStore.settings.home.fullPath &&
            router.currentRoute.value.name !== 'login' && { redirect })
        }
      })
    }

    // 获取权限
    async function getPermissions() {
      const res = await apiUser.permission()
      permissions.value = res.data
    }

    // 修改密码
    async function editPassword(data: { password: string; newpassword: string }) {
      await apiUser.passwordEdit(data)
    }

    return {
      token,
      userInfo,
      permissions,
      isLogin,
      login,
      logout,
      getPermissions,
      getUserInfo,
      editPassword
    }
  }
)

export default useUserStore
