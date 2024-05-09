import { Module } from '@nestjs/common'
import { ZoningController } from './zoning.controller'
import { ZoningService } from './zoning.service'

@Module({
  controllers: [ZoningController],
  providers: [ZoningService]
})
export class ZoningModule {}
