import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type {
  CreateUserPostDto,
  UpdateUserPostDto,
  UserPost,
} from './post.interface';

@Injectable()
export default class UserPostService {
  public constructor(private readonly db: PrismaClient) {}

  public async create(dto: CreateUserPostDto): Promise<UserPost> {
    const createdPost = await this.db.userPost.create({
      data: {
        title: dto.title,
        content: dto.content,
        author: { connect: { id: dto.authorId } },
      },
      include: {
        author: true,
      },
    });

    return createdPost;
  }

  public async update(dto: UpdateUserPostDto): Promise<UserPost | undefined> {
    const updatedPost = await this.db.userPost.update({
      where: { id: dto.id },
      data: {
        title: dto.title,
        content: dto.content,
      },
      include: {
        author: true,
      },
    });

    if (!updatedPost) {
      return undefined;
    }

    return updatedPost;
  }

  public async delete(id: number): Promise<UserPost | undefined> {
    const deletedPost = await this.db.userPost.delete({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!deletedPost) {
      return undefined;
    }

    return deletedPost;
  }

  public async get(id: number): Promise<UserPost | undefined> {
    const post = await this.db.userPost.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return undefined;
    }

    return post;
  }

  public async getMany(authorId: number): Promise<UserPost[]> {
    const posts = await this.db.userPost.findMany({
      where: {
        authorId,
      },
      include: {
        author: true,
      },
    });

    return posts;
  }
}
