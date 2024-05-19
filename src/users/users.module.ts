import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserPostsModule } from './modules/post/post.module';
import { DialogsModule } from './modules/dialogs/dialogs.module';

@Module({
  imports: [UserPostsModule, DialogsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaClient],
})
export class UsersModule {}
