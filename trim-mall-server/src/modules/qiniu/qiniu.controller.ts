import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { QiniuService } from './qiniu.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { response } from '../../utils/response'
import { UploadCallback } from './types'

@Controller('/file')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const res: UploadCallback = await this.qiniuService.upload(file)
      const url = await this.qiniuService.preview(res.key)
      return response.ok({
        ...res,
        url
      })
    } catch (e) {
      return response.fail('上传失败')
    }
  }

  @Get('/preview')
  async getPreviewUrl(@Query('key') key: string) {
    try {
      const url = await this.qiniuService.preview(key)
      return response.ok(url)
    } catch (e) {
      return response.fail()
    }
  }
}
