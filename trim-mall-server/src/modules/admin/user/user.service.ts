import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginationDto } from '../../../dto/pagination.dto'
import { pagination } from '../../../utils/pagination'
import { SearchDto } from './dto/search.dto'
import { UserInfoDto } from './dto/info.dto'

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
    const { page = 1, limit = 10, username } = params
    console.log(Object.keys(Object.getOwnPropertyNames(new UserInfoDto())))
    const list = await this.prisma.sysUser.findMany({
      ...pagination(page, limit),
      where: {
        username: {
          contains: username
        }
      },
      select: {
        username: true,
        email: true,
        mobilePhone: true,
        nickname: true,
        status: true,
        avatarKey: true,
        createTime: true,
        updateTime: true,
        userRole: true
      }
    })
    const total = await this.prisma.sysUser.count()
    return { list, total, page, limit }
  }

  async findOneById(id: number) {
    return await this.prisma.sysUser.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        username: true,
        email: true,
        mobilePhone: true,
        nickname: true,
        status: true,
        avatarKey: true,
        createTime: true,
        updateTime: true
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
