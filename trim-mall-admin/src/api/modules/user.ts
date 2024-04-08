import api from '../index'

export default {
  // 登录
  login: (data: { username: string; password: string }) => api.post('auth/login', data),

  // 获取权限
  permission: () => api.get('user/permission'),

  // 修改密码
  passwordEdit: (data: { password: string; newpassword: string }) => api.post('user/password/edit', data)
}
