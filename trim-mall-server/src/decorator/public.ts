import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'Trim_Public'
export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true)
}
