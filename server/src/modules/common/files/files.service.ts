import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as qiniu from 'qiniu'
import { Readable } from 'stream'
import { UploadCallback } from './types'
import { v4 as uuidV4 } from 'uuid'

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  ak = this.configService.get<string>('files.ak')
  sk = this.configService.get<string>('files.sk')
  bucket = this.configService.get<string>('files.bucket')

  // 生成凭证
  generateMac() {
    return new qiniu.auth.digest.Mac(this.ak, this.sk)
  }

  // 生成上传凭证
  generateUploadToken() {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: this.bucket,
      // 定义返回格式
      // 魔法变量：https://developer.qiniu.com/kodo/1235/vars#magicvar
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","imageInfo":$(imageInfo),"fname":"$(fname)","fsize":$(fsize),"type":"$(mimeType)"}'
    })
    return putPolicy.uploadToken(this.generateMac())
  }

  // 上传
  async upload(file: Express.Multer.File): Promise<UploadCallback> {
    const uploader = new qiniu.form_up.FormUploader(
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z0,
        useHttpsDomain: true
      })
    )
    const putExtra = new qiniu.form_up.PutExtra()
    // buffer转换为可读流
    const stream = Readable.from(file.buffer)

    return new Promise((resolve, reject) => {
      uploader.putStream(
        this.generateUploadToken(),
        `${uuidV4()}.${file.originalname}`,
        stream,
        putExtra,
        (e, respBody, respInfo) => {
          if (e) {
            reject(e)
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody)
          } else {
            reject(respBody)
          }
        }
      )
    })
  }

  // 生成预览链接
  async preview(key: string) {
    const bucketManager = new qiniu.rs.BucketManager(
      this.generateMac(),
      new qiniu.conf.Config({
        zone: qiniu.zone.Zone_z0,
        useHttpsDomain: true
      })
    )
    const domain = this.configService.get<string>('files.domain')
    // 1小时后过期
    const deadline = Math.floor(Date.now() / 1000) + 3600
    return bucketManager.privateDownloadUrl(domain, key, deadline)
  }
}
