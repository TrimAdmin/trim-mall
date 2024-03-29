import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './dto/login.dto'
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
}
