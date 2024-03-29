import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { QueryAreaDto, QueryCityDto, QueryStreetDto } from './dto/query.dto'

@Injectable()
export class ZoningService {
  prisma = new PrismaClient()

  // 获取行政区划树（到区县）
  async getTree() {
    return await this.prisma.addProvince.findMany({
      include: {
        AddCity: {
          include: {
            AddArea: true
          }
        }
      }
    })
  }

  // 获取省份列表
  async getProvinceList() {
    return await this.prisma.addProvince.findMany()
  }

  // 获取市列表
  async getCityList(cityDto: QueryCityDto) {
    return await this.prisma.addCity.findMany({
      where: {
        provinceCode: cityDto.provinceCode
      }
    })
  }

  // 获取区县列表
  async getAreaList(areaDto: QueryAreaDto) {
    return await this.prisma.addArea.findMany({
      where: {
        cityCode: areaDto.cityCode
      }
    })
  }

  // 获取街道列表
  async getStreetList(streetDto: QueryStreetDto) {
    return await this.prisma.addStreet.findMany({
      where: {
        areaCode: streetDto.areaCode
      }
    })
  }
}
