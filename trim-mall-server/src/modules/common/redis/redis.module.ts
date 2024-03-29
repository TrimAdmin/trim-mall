import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { RedisService } from './redis.service'

@Global()
@Module({
  imports: [
    // redis
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('redis.host'),
        port: configService.get<string>('redis.port'),
        db: configService.get<string>('redis.db'),
        password: configService.get<string>('redis.password')
      })
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
