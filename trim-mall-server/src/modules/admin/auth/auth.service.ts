import { Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByUsername(loginDto.username)
    if (!user) return Promise.reject('用户不存在')
    return Promise.resolve(user)
  }
}
