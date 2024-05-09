import * as process from 'process'
import { ConfigFactory } from '@nestjs/config'
import { CacheOptions } from '@nestjs/cache-manager'

type ConfigType = {
  redis: CacheOptions
  files: {
    ak: string
    sk: string
    bucket: string
    domain: string
  }
  jwt: {
    secret: string
  }
}

const config: ConfigFactory<ConfigType> = () => {
  console.log('Currently is under:', process.env.NODE_ENV)
  return {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      db: process.env.REDIS_DB
    },
    files: {
      ak: process.env.FILES_ACCESS_KEY,
      sk: process.env.FILES_SECRET_KEY,
      bucket: process.env.FILES_BUCKET,
      domain: process.env.FILES_DOMAIN
    },
    jwt: {
      secret: process.env.JWT_SECRET
    }
  }
}

export default config
