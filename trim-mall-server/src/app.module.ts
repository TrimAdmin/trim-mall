import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TenantMiddleware } from './middleware/tenant.middleware'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { RedisModule } from './modules/common/redis/redis.module'
import { FilesModule } from './modules/common/files/files.module'
import { DatabaseModule } from './modules/common/database/database.module'
import { UserModule } from './modules/admin/user/user.module'
import { RouterModule } from '@nestjs/core'
import { AdminModule } from './modules/admin/admin.module'

@Module({
  imports: [
    // env
    ConfigModule.forRoot({
      load: [config],
      envFilePath: ['.env', '.env.dev', '.env.prod']
    }),
    // database
    DatabaseModule,
    // redis
    RedisModule,
    // uploader
    FilesModule,
    AdminModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 多租户中间件
    consumer.apply(TenantMiddleware).forRoutes('')
  }
}
