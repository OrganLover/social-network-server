import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { COOKIE } from './auth.constant';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { LoginUserDto, RegisterUserDto } from './dto/auth.dto';
import type { DataToEncode, DecodedData } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto, reply: FastifyReply) {
    const { passwordHash, ...createdUser } =
      await this.usersService.create(registerUserDto);

    const dataToEncode: DataToEncode = { id: createdUser.id };
    const token = await this.jwtService.signAsync(dataToEncode);

    reply.cookie(COOKIE.JWT, token, { httpOnly: true });

    return {
      token,
      user: createdUser,
    };
  }

  async loginUser({ email, password }: LoginUserDto, reply: FastifyReply) {
    const { passwordHash, ...user } = await this.usersService.findBy({ email });
    const passwordMismatch = !(await bcrypt.compare(password, passwordHash));

    if (!user || passwordMismatch) {
      throw new BadRequestException('invalid credentials');
    }

    const dataToEncode: DataToEncode = { id: user.id };
    const token = await this.jwtService.signAsync(dataToEncode);

    reply.cookie(COOKIE.JWT, token, { httpOnly: true });

    return {
      token,
      user,
    };
  }

  async getUser(request: FastifyRequest) {
    try {
      const cookie = request.cookies[COOKIE.JWT];
      const { id } = await this.jwtService.verifyAsync<DecodedData>(cookie);

      if (!id) {
        throw new UnauthorizedException();
      }

      const { passwordHash, ...userData } = await this.usersService.findBy({
        id,
      });

      return { user: userData };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
