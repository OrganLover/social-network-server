import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Ошибка в типизации одного из пакетов
  await app.register(fastifyCookie);
  app.setGlobalPrefix('/api');
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:5173',
  });

  await app.listen(3000);
}
bootstrap();
