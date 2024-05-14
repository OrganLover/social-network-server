import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import UserPostService from './post.service';
import UserPostController from './post.controller';

@Module({
  controllers: [UserPostController],
  providers: [UserPostService, PrismaClient],
})
export class UsersModule {}
