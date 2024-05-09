import { SetMetadata } from '@nestjs/common'

export function Permission(permissions: string[]) {
  return SetMetadata('permission', permissions)
}
