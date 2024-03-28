import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'prisma/prisma-client/scripts/default-index'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor() {
    super()
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onApplicationShutdown() {
    await this.$disconnect()
  }
}
