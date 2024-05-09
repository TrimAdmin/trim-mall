import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { Reflector } from '@nestjs/core'
import { StatusCodes } from 'http-status-codes'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取接口所需权限
    const permissions = this.reflector.getAllAndOverride('permission', [context.getClass(), context.getHandler()])
    // 无需权限则放行
    if (!permissions) return true
    try {
      const request = context.switchToHttp().getRequest()
      const user = request['user']
      const userPerms = await this.userService.getUserPermission(user.sub)
      if (
        // 特殊处理 放行全部权限
        userPerms.find((item) => item === '*:*') ||
        // 查找是否有所需权限
        userPerms.map((item) => permissions.find((i) => i === item)).filter(Boolean).length
      ) {
        return true
      }
    } catch (e) {
      throw new HttpException('暂无权限，请联系管理员添加', StatusCodes.FORBIDDEN)
    }
  }
}
