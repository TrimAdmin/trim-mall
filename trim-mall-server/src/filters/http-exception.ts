import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import type { Response } from 'express'
import { response } from '../utils/response'
import { StatusCodes } from 'http-status-codes'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>()
    const status = exception.getStatus()
    const exceptionRes = exception.getResponse() as any
    // 获取异常信息
    const msg =
      typeof exceptionRes === 'string'
        ? exceptionRes
        : // 对校验单独处理
          exceptionRes && exceptionRes.message.join('')

    if (msg) {
      res.status(status).json(response.response(status, msg, false))
    } else {
      switch (status) {
        case StatusCodes.BAD_REQUEST:
          res.status(status).json(response.fail())
          break
        case StatusCodes.INTERNAL_SERVER_ERROR:
          res.status(status).json(response.error())
          break
        default:
          res.status(status).json(response.fail())
          break
      }
    }
  }
}
