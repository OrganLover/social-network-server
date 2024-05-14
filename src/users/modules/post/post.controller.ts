import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { joiBodyValidatorDecorator } from 'libs';

import UserPostService from './post.service';
import createUserPostSchema from './dto/joi-schemas/create.schema';
import updateUserPostSchema from './dto/joi-schemas/update.schema';

import type { CreateUserPostDto, UpdateUserPostDto } from './post.interface';

@Controller('/user-posts')
export default class UserPostController {
  constructor(private readonly service: UserPostService) {}

  @Post()
  public create(
    @joiBodyValidatorDecorator(createUserPostSchema) dto: CreateUserPostDto,
  ) {
    return this.service.create(dto);
  }

  @Put(':authorId')
  public update(
    @joiBodyValidatorDecorator(updateUserPostSchema)
    dto: Omit<UpdateUserPostDto, 'id'>,
    @Param('authorId', ParseIntPipe) id: number,
  ) {
    return this.service.update({ ...dto, id });
  }

  @Get(':id')
  public get(@Param('id', ParseIntPipe) id: number) {
    return this.service.get(id);
  }

  @Get('by-author/:authorId')
  public getByAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.service.getMany(authorId);
  }

  @Delete(':authorId')
  public delete(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.service.delete(authorId);
  }
}
