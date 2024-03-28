import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { response } from '../../../utils/response'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/list')
  async getUser() {
    return response.ok(await this.userService.getUserList())
  }
}
