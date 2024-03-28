import { Inject, Injectable } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class RedisService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {}

  set(key: string, value: string, ttl?: number) {
    this.cacheManager.set(key, value, ttl || 0).catch((err) => {
      if (err) {
        throw err
      }
    })
  }

  async get(key: string) {
    return this.cacheManager.get(key)
  }

  async delete(key: string) {
    return this.cacheManager.del(key)
  }

  async reset() {
    this.cacheManager.reset()
  }
}
