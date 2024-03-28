import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import type { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { response } from '../utils/response'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    // 后端返回错误码
    let code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
    // 后端返回信息
    let message: string = getReasonPhrase(code)

    if (exception instanceof HttpException) {
      const result = exception.getResponse() as any
      code = result.statusCode
      message = result.message ?? getReasonPhrase(code)
    } else {
      message = exception.message ?? getReasonPhrase(code)
    }

    return response.response(code, message, false)
  }
}
