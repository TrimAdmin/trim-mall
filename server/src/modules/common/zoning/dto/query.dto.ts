import { IsNotEmpty } from 'class-validator'

export class QueryCityDto {
  @IsNotEmpty({
    message: '省级编码不能为空'
  })
  provinceCode: string
}

export class QueryAreaDto {
  @IsNotEmpty({
    message: '市级编码不能为空'
  })
  cityCode: string
}

export class QueryStreetDto {
  @IsNotEmpty({
    message: '区县级编码不能为空'
  })
  areaCode: string
}
