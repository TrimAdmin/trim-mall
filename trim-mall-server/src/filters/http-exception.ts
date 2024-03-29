import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import type { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { response } from '../utils/response'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    // 后端返回错误码
    let code: StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
    // 后端返回信息
    let message: string = getReasonPhrase(code)

    console.log(code)

    if (exception instanceof HttpException) {
      const result = exception.getResponse() as any
      code = result.statusCode
      message = result.message ?? getReasonPhrase(code)
    } else {
      message = getReasonPhrase(code)
    }

    console.log(res)

    return response.response(code, message, false)
  }
}
