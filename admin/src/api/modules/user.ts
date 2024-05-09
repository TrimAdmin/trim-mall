import api from '../index'
import { UserInfo } from '#/system/user'
import { PaginationData, PaginationParams } from '#/global'

export default {
  // 登录
  login: (data: { username: string; password: string }) => api.post<string>('auth/login', data),

  // 获取权限
  permission: () => api.get<string[]>('auth/permission'),

  // 获取用户信息
  getUserInfo: () => api.get<UserInfo>('auth/user-info'),

  // 修改密码
  passwordEdit: (data: { password: string; newpassword: string }) => api.post('user/password/edit', data),

  // 获取用户分页列表
  getUserPage: (params?: PaginationParams) => api.get<PaginationData>('user/page', { params })
}
