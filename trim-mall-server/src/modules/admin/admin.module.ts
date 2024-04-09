import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { RouterModule } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { PermissionModule } from './permission/permission.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    PermissionModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [UserModule, AuthModule]
      }
    ])
  ]
})
export class AdminModule {}
