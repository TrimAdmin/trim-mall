import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { IS_PUBLIC_KEY } from '../../../decorator/public'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否是存在Public注解
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = request.headers['token'] ?? ''
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.secret')
      })
      return true
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
