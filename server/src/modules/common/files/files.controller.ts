import { Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Express } from 'express'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { response } from '../../../utils/response'
import { UploadCallback } from './types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('/file')
@ApiTags('文件相关')
export class FilesController {
  constructor(private readonly qiniuService: FilesService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '文件上传'
  })
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
  @ApiOperation({
    summary: '文件预览'
  })
  async getPreviewUrl(@Query('key') key: string) {
    try {
      const url = await this.qiniuService.preview(key)
      return response.ok(url)
    } catch (e) {
      return response.fail()
    }
  }
}
