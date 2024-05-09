import { HttpException, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PaginationDto } from '../../../dto/pagination.dto'
import { pagination } from '../../../utils/pagination'
import { SearchDto } from './dto/search.dto'
import { UserInfoDto } from './dto/info.dto'
import { FilesService } from '../../common/files/files.service'
import { StatusCodes } from 'http-status-codes'

@Injectable()
export class UserService {
  constructor(private readonly filesService: FilesService) {}

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
        avatar: true,
        createTime: true,
        updateTime: true
      }
    })
    const total = await this.prisma.sysUser.count()
    return { list, total, page, limit }
  }

  async findOneById(id: number) {
    const user = await this.prisma.sysUser.findUnique({
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
        avatar: true,
        createTime: true,
        updateTime: true
      }
    })
    if (!user.id) throw new HttpException('用户不存在', StatusCodes.BAD_REQUEST)
    return Promise.resolve(user)
  }

  // 获取用户权限列表
  async getUserPermission(userId: number) {
    const userRoles = await this.prisma.sysUserRole.findMany({
      where: {
        userId
      },
      select: {
        roleId: true
      }
    })
    const permissions = await Promise.all(
      userRoles.map(({ roleId }) => {
        return this.prisma.sysRolePermission.findMany({
          where: {
            roleId
          },
          select: {
            permission: true
          }
        })
      })
    )
    return permissions.flat().map((item) => item.permission)
  }

  async findOneByUsername(username: string) {
    return await this.prisma.sysUser.findFirst({
      where: {
        username
      }
    })
  }
}
