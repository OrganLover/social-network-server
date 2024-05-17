import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Put,
  Post,
  Req,
  Res,
  StreamableFile,
  BadRequestException,
} from '@nestjs/common';
import { joiBodyValidatorDecorator } from 'libs';

import { UsersService } from './users.service';
import updateUserSchema from './dto/joi-schemas/update-user.schema';
import { ERROR, MIME_TYPE_PREFIX } from './users.constant';

import type { FastifyReply, FastifyRequest } from 'fastify';
import type { UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post('avatars/:userId')
  public async uploadAvatar(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: FastifyRequest,
  ) {
    const data = await req.file();

    if (!data) {
      throw new BadRequestException(ERROR.FILE_NOT_PROVIDED);
    }

    const fileName = await this.service.uploadAvatar(userId, data);

    return { fileName };
  }

  @Get('avatars/:fileName')
  public getAvatar(
    @Param('fileName') fileName: string,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { image, fileExtension } = this.service.getAvatar(fileName);

    reply.type(`${MIME_TYPE_PREFIX}${fileExtension}`);

    return new StreamableFile(image);
  }

  @Put(':userId')
  public update(
    @joiBodyValidatorDecorator(updateUserSchema) dto: Omit<UpdateUserDto, 'id'>,
    @Param('userId', ParseIntPipe) id: number,
  ) {
    return this.service.update({ ...dto, id });
  }

  @Get()
  public getMany() {
    return this.service.getMany();
  }

  @Get(':userId')
  public get(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.get(userId);
  }

  @Delete(':userId')
  public delete(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.delete(userId);
  }
}
