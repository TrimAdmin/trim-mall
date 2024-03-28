import { Module } from '@nestjs/common'
import { QiniuService } from './qiniu.service'
import { ConfigModule } from '@nestjs/config'
import { QiniuController } from './qiniu.controller'

@Module({
  imports: [ConfigModule],
  controllers: [QiniuController],
  providers: [QiniuService],
  exports: [QiniuService]
})
export class QiniuModule {}
