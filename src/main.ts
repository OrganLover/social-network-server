import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Ошибка в типизации одного из пакетов
  await app.register(fastifyCookie);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Ошибка в типизации одного из пакетов
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 1024 * 1024 * 5,
      files: 1,
    },
  });

  app.setGlobalPrefix('/api');
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
  });

  await app.listen(3000);
}
bootstrap();
