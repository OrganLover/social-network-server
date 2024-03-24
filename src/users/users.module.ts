import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaClient],
})
export class UsersModule {}
