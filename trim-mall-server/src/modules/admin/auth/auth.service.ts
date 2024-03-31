import { Header, HttpException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { UserService } from '../user/user.service'
import { compare, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'
import { StatusCodes } from 'http-status-codes'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  prisma = new PrismaClient()

  // 登录
  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByUsername(loginDto.username)
    if (!user) {
      throw new HttpException('用户名错误或不存在', StatusCodes.BAD_REQUEST)
    }
    const isSame = await compare(loginDto.password, user.password)
    if (!isSame) {
      throw new HttpException('密码错误', StatusCodes.BAD_REQUEST)
    }
    try {
      const payload = {
        sub: user.id,
        username: user.username
      }
      const secret = this.configService.get<string>('jwt.secret')
      const token = await this.jwtService.signAsync(payload, { secret })
      return Promise.resolve(token)
    } catch (e) {
      throw new HttpException(e, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  // 获取当前用户信息
  async getUserInfo(token: string) {
    try {
      const secret = this.configService.get<string>('jwt.secret')
      const payload = await this.jwtService.verifyAsync(token, { secret })
      const user = await this.userService.findOneById(payload.sub)
      return Promise.resolve(user)
    } catch (e) {
      throw new HttpException(e, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  // 注册
  async register() {}
}
