import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { JwtService } from '@nestjs/jwt'
import { FilesModule } from '../../common/files/files.module'

@Module({
  providers: [UserService, JwtService],
  exports: [UserService],
  controllers: [UserController],
  imports: [FilesModule]
})
export class UserModule {}
