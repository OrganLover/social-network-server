import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { JwtTokenService } from './services/jwt-token.service';
import { COOKIE } from './auth.constant';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import type { DataToEncode } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtTokenService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, reply: FastifyReply) {
    const emailAlreadyExists = await this.usersService.findBy({
      email: registerUserDto.email,
    });

    if (emailAlreadyExists) {
      throw new ConflictException('Email already exists', {
        description: 'auth.email-already-exists',
      });
    }

    const { passwordHash, ...user } =
      await this.usersService.create(registerUserDto);

    const dataToEncode: DataToEncode = { id: user.id };
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(dataToEncode);

    reply.setCookie(COOKIE.JWT, refreshToken);

    return {
      token: accessToken,
      user,
    };
  }

  async loginUser({ email, password }: LoginUserDto, reply: FastifyReply) {
    const userData = await this.usersService.findBy({ email });

    if (!userData) {
      throw new BadRequestException('user not found', {
        description: 'auth.invalid-credentials',
      });
    }

    const { passwordHash, ...user } = userData;
    const passwordMismatch = !(await bcrypt.compare(password, passwordHash));

    if (passwordMismatch) {
      throw new BadRequestException('invalid credentials', {
        description: 'auth.invalid-credentials',
      });
    }

    const dataToEncode: DataToEncode = { id: user.id };
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokens(dataToEncode);

    reply.setCookie(COOKIE.JWT, refreshToken);

    return {
      token: accessToken,
      user,
    };
  }

  async getUser(request: FastifyRequest) {
    try {
      const cookie = request.cookies[COOKIE.JWT];

      if (!cookie) {
        throw new UnauthorizedException('unauthorized', {
          description: 'unauthorized',
        });
      }

      const { id } = await this.jwtService.verifyToken(cookie);
      const userData = await this.usersService.findBy({
        id,
      });

      if (!userData) {
        throw new UnauthorizedException('unauthorized', {
          description: 'unauthorized',
        });
      }

      const { passwordHash, ...user } = userData;

      return { user };
    } catch (error) {
      throw new UnauthorizedException('unauthorized', {
        description: 'unauthorized',
      });
    }
  }
}
