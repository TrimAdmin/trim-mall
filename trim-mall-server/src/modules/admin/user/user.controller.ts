import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { response } from '../../../utils/response'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('/user')
@ApiTags('管理后台-用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  @ApiOperation({ summary: '获取所有用户列表' })
  async getUser() {
    return response.ok(await this.userService.getUserList())
  }
}
