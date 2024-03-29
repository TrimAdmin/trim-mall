import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { response } from '../../../utils/response'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PaginationDto } from '../../../dto/pagination.dto'
import { SearchDto } from './dto/search.dto'

@Controller('user')
@ApiTags('管理后台-用户管理')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @ApiOperation({ summary: '获取所有用户列表' })
  async list(@Query() params: SearchDto) {
    return response.ok(await this.userService.getUserList(params))
  }

  @Get('page')
  @ApiOperation({ summary: '分页获取用户' })
  async page(@Query() params: PaginationDto & SearchDto) {
    return response.ok(await this.userService.getUserPage(params))
  }
}
