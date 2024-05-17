import fs from 'fs';
import { createHash } from 'crypto';
import path from 'path';

import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { isPathExists, pump } from 'libs/utils/utils';

import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { ERROR, IMAGE_TYPE_ALLOW_LIST, PATH_TO_IMAGES } from './users.constant';

import type { User } from './users.interface';
import type { MultipartFile } from '@fastify/multipart';

@Injectable()
export class UsersService {
  public constructor(private readonly db: PrismaClient) {}

  async create({
    email,
    password,
    userName: name,
  }: CreateUserDto): Promise<User & { passwordHash: string }> {
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

    const userName = name ?? `User${createdUser.id}`;
    const createdUserProfile = await this.db.userProfile.create({
      data: {
        userName,
        user: { connect: { id: createdUser.id } },
      },
    });

    return { ...createdUser, profile: createdUserProfile };
  }

  public async update(dto: UpdateUserDto): Promise<User | undefined> {
    const updateUser = await this.db.user.update({
      where: {
        id: dto.id,
      },
      data: {
        profile: {
          update: {
            userName: dto.userName,
            aboutMe: dto.aboutMe,
            avatarPath: dto.avatarPath,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    if (!updateUser) {
      return undefined;
    }

    const { passwordHash, ...userData } = updateUser;

    return userData;
  }

  public async get(id: number): Promise<User | undefined> {
    const user = await this.db.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return undefined;
    }

    const { passwordHash, ...userData } = user;

    return userData;
  }

  public async getMany(): Promise<User[]> {
    return await this.db.user.findMany({ include: { profile: true } });
  }

  public async delete(id: number): Promise<User | undefined> {
    const deletedUser = await this.db.user.delete({
      where: {
        id,
      },
      include: {
        profile: true,
      },
    });

    if (!deletedUser) {
      return undefined;
    }

    const { passwordHash, ...userData } = deletedUser;

    return userData;
  }

  async findBy(property: {
    id?: number;
    email?: string;
  }): Promise<(User & { passwordHash: string }) | undefined> {
    const key = Object.keys(property)[0];

    switch (key) {
      case 'id': {
        return (
          (await this.db.user.findUnique({
            where: { id: property.id },
            include: { profile: true },
          })) ?? undefined
        );
      }

      case 'email': {
        return (
          (await this.db.user.findUnique({
            where: { email: property.email },
            include: { profile: true },
          })) ?? undefined
        );
      }
    }
  }

  public async uploadAvatar(userId: number, data: MultipartFile) {
    const user = await this.get(userId);

    if (!user) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND);
    }

    // Если размер файла превышает лимит
    if (data.file.truncated) {
      throw new BadRequestException(ERROR.FILE_MAX_SIZE_LIMIT);
    }

    let imageType: string | undefined = undefined;

    const isImageFile = data.mimetype.startsWith('image/');

    if (isImageFile) {
      imageType = data.mimetype.split('/')[1];
    }

    if (!imageType || !IMAGE_TYPE_ALLOW_LIST.includes(imageType)) {
      throw new BadRequestException(ERROR.FILE_TYPE_NOT_ACCEPTABLE);
    }

    if (!(await isPathExists(PATH_TO_IMAGES))) {
      await fs.promises.mkdir(PATH_TO_IMAGES, { recursive: true });
    }

    const unixTimestamp = Math.floor(Date.now() / 1000).toString();
    const hash = createHash('sha1').update(data.filename).update(unixTimestamp);
    const fileName = `${hash.digest('hex')}.${imageType}`;
    const pathToImage = path.join(PATH_TO_IMAGES, fileName);

    await pump(data.file, fs.createWriteStream(pathToImage));

    if (!(await isPathExists(PATH_TO_IMAGES))) {
      throw new InternalServerErrorException(ERROR.FILE_SAVE_FAILED);
    }

    const updatedUser = await this.update({
      id: userId,
      avatarPath: fileName,
    });

    if (!updatedUser) {
      throw new NotFoundException(ERROR.USER_NOT_FOUND);
    }

    return updatedUser.profile!.avatarPath!;
  }

  public getAvatar(fileName: string): {
    image: fs.ReadStream;
    fileExtension: string;
  } {
    const image = fs.createReadStream(path.join(PATH_TO_IMAGES, fileName));
    const array = fileName.split('.');
    const fileExtension = array[array.length - 1];

    return { image, fileExtension };
  }
}
