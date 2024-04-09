import { Body, Controller, Get, Headers, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './auth.dto'
import { response } from '../../../utils/response'
import { Public } from 'src/decorator/public'

@Controller('auth')
@ApiTags('管理后台-认证相关')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '登录' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto)
    return response.ok(token)
  }

  @Get('user-info')
  @ApiOperation({ summary: '获取用户信息' })
  async getUserInfo(@Headers() headers: { token: string }) {
    const { token } = headers
    // 解析token
    const userInfo = await this.authService.getUserInfo(token)
    return response.ok(userInfo)
  }

  @Get('permission')
  @ApiOperation({ summary: '获取用户权限列表' })
  async getUserPermission(@Headers() headers: { token: string }) {
    const { token } = headers
    const permission = await this.authService.getUserPermission(token)
    return response.ok(permission)
  }
}
