import { MiddlewareConsumer, Module, NestModule, UseFilters } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { RedisModule } from './modules/common/redis/redis.module'
import { FilesModule } from './modules/common/files/files.module'
import { DatabaseModule } from './modules/common/database/database.module'
import { AdminModule } from './modules/admin/admin.module'
import { ZoningModule } from './modules/common/zoning/zoning.module'

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
    // zoning
    ZoningModule,
    AdminModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {}
}
