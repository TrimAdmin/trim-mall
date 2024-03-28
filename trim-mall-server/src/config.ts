import * as process from 'process'
import { ConfigFactory } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { CacheOptions } from '@nestjs/cache-manager'

type ConfigType = {
  database: TypeOrmModuleOptions
  redis: CacheOptions
  qiniu: {
    ak: string
    sk: string
    bucket: string
    domain: string
  }
}

const config: ConfigFactory<ConfigType> = () => {
  console.log('Currently is under:', process.env.NODE_ENV)
  return {
    database: {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB
    },
    qiniu: {
      ak: process.env.QINIU_ACCESS_KEY,
      sk: process.env.QINIU_SECRET_KEY,
      bucket: process.env.QINIU_BUCKET,
      domain: process.env.QINIU_DOMAIN
    }
  }
}

export default config
