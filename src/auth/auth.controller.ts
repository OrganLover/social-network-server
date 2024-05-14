import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import joiBodyValidatorDecorator from 'libs/decorators/joi/joi-body-validator.decorator';
import { COOKIE } from 'src/app.constant';

import { AuthService } from './auth.service';
import {
  loginUserSchema,
  registerUserSchema,
} from './dto/joi-schemas/auth.schema';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { LoginUserDto, RegisterUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @joiBodyValidatorDecorator(registerUserSchema)
    registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return this.authService.registerUser(registerUserDto, reply);
  }

  @Post('login')
  loginUser(
    @joiBodyValidatorDecorator(loginUserSchema) loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    return this.authService.loginUser(loginUserDto, reply);
  }

  @Get('me')
  getMe(@Req() request: FastifyRequest) {
    return this.authService.getUser(request);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    reply.setCookie(COOKIE.JWT, '');

    return {
      success: true,
    };
  }
}
