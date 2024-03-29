import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { RouterModule } from '@nestjs/core'

@Module({
  imports: [
    UserModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [UserModule]
      }
    ])
  ]
})
export class AdminModule {}
