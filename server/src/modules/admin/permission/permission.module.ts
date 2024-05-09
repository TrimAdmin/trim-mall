import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { PermissionGuard } from './permission.guard'
import { UserModule } from '../user/user.module'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ],
  imports: [UserModule]
})
export class PermissionModule {}
