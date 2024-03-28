import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const tenantId = req.headers['tenant-id']
    if (tenantId) {
      console.log('tenant-id', tenantId)
    }
    next()
  }
}
