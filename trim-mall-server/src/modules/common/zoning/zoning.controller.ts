import { Controller, Get, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ZoningService } from './zoning.service'
import { response } from '../../../utils/response'
import { QueryAreaDto, QueryCityDto, QueryStreetDto } from './dto/query.dto'

@Controller('zoning')
@ApiTags('通用-行政区划')
export class ZoningController {
  constructor(private readonly zoningService: ZoningService) {}
  @Get('tree')
  @ApiOperation({ summary: '获取行政区划树（区县维度）' })
  async getTree() {
    return response.ok(await this.zoningService.getTree())
  }

  @Get('province')
  @ApiOperation({ summary: '获取省份列表' })
  async getProvinceList() {
    return response.ok(await this.zoningService.getProvinceList())
  }

  @Get('city')
  @ApiOperation({ summary: '获取市级列表' })
  async getCityList(@Query() cityDto: QueryCityDto) {
    return response.ok(await this.zoningService.getCityList(cityDto))
  }

  @Get('area')
  @ApiOperation({ summary: '获取区县列表' })
  async getAreaList(@Query() areaDto: QueryAreaDto) {
    return response.ok(await this.zoningService.getAreaList(areaDto))
  }

  @Get('street')
  @ApiOperation({ summary: '获取乡镇/街道列表' })
  async getStreetList(@Query() streetDto: QueryStreetDto) {
    return response.ok(await this.zoningService.getStreetList(streetDto))
  }
}
