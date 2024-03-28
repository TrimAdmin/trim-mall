import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as process from 'process'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 非生产环境下开启swagger
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Trim Mall')
      .setDescription('Trim mall api document')
      .setVersion('1.0')
      .build()
    const swagger = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, swagger)
  }
  // 启用跨域
  app.enableCors({
    origin: true,
    credentials: true,
    maxAge: 1728000
  })
  const port = process.env.APP_PORT || 3000
  console.log(`Server running on port ${port}`)
  // 启动服务
  await app.listen(port)
}

bootstrap()
