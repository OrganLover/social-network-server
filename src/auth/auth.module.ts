import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaClient],
  imports: [
    JwtModule.register({
      secret: 'secretFKey',
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
})
export class AuthModule {}
