import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { CreateUserDto } from './dto/user.dto';

import type { User } from './users.interface';

@Injectable()
export class UsersService {
  public constructor(private readonly db: PrismaClient) {}

  async create({ email, password, profile }: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);

    const createdUser = await this.db.user.create({
      data: {
        email,
        passwordHash,
      },

      include: {
        profile: true,
      },
    });

    const userName = profile?.userName ?? `User${createdUser.id}`;
    const createdUserProfile = await this.db.userProfile.create({
      data: {
        userName,
        user: { connect: { id: createdUser.id } },
      },
    });

    return { ...createdUser, profile: createdUserProfile };
  }

  async findBy(property: {
    id?: number;
    email?: string;
  }): Promise<User | undefined> {
    const key = Object.keys(property)[0];

    switch (key) {
      case 'id': {
        return await this.db.user.findUniqueOrThrow({
          where: { id: property.id },
          include: { profile: true },
        });
      }

      case 'email': {
        return await this.db.user.findUniqueOrThrow({
          where: { email: property.email },
          include: { profile: true },
        });
      }
    }
  }
}
