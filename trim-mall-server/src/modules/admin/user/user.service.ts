import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginationDto } from '../../../dto/pagination.dto'
import { pagination } from '../../../utils/pagination'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class UserService {
  constructor() {}

  prisma = new PrismaClient()

  async getUserList(params: SearchDto) {
    const { username } = params
    return await this.prisma.sysUser.findMany({
      where: {
        username: {
          contains: username
        }
      }
    })
  }

  async getUserPage(params: PaginationDto & SearchDto) {
    const { page, limit, username } = params
    return await this.prisma.sysUser.findMany({
      ...pagination(page, limit),
      where: {
        username: {
          contains: username
        }
      }
    })
  }

  async findOneById(id: number) {
    return await this.prisma.sysUser.findUnique({
      where: {
        id
      }
    })
  }

  async findOneByUsername(username: string) {
    return await this.prisma.sysUser.findFirst({
      where: {
        username
      }
    })
  }
}
