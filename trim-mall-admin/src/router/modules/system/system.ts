import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: () => import('@/layouts/index.vue'),
  redirect: { name: 'SystemUser' },
  meta: {
    title: '系统管理',
    auth: 'system:manage'
  },
  children: [
    {
      path: 'user',
      name: 'SystemUser',
      component: () => import('@/views/system-manage/user/index.vue'),
      meta: {
        title: '用户管理',
        auth: 'system:manage:user'
      },
      children: [
        {
          path: 'add',
          name: 'SystemUserAdd',
          component: () => import('@/views/system-manage/user/index.vue'),
          meta: {
            title: '新增用户',
            menu: false,
            auth: 'system:manage:create'
          }
        }
      ]
    }
  ]
}

export default routes
