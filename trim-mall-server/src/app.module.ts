import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TenantMiddleware } from './middleware/tenant.middleware'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from './config'
import { RedisModule } from './modules/redis/redis.module'
import { FilesModule } from './modules/files/files.module'

@Module({
  imports: [
    // env
    ConfigModule.forRoot({
      load: [config],
      envFilePath: ['.env', '.env.dev', '.env.prod', '.env.local']
    }),
    // database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true
      })
    }),
    // redis
    RedisModule,
    // uploader
    FilesModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 多租户中间件
    consumer.apply(TenantMiddleware).forRoutes('')
  }
}
