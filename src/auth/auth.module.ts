import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './services/jwt-token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaClient, JwtTokenService],
  imports: [JwtModule.register({ global: true })],
})
export class AuthModule {}
