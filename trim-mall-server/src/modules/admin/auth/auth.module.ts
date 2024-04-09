import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
  imports: [
    UserModule,
    JwtModule.register({
      global: true
    })
  ],
  exports: [AuthService]
})
export class AuthModule {}
