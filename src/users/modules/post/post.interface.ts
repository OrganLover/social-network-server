import { User } from '@prisma/client';

export type CreateUserPostDto = {
  authorId: number;
  title: string;
  content: string;
};

export type UpdateUserPostDto = {
  id: number;
  title?: string;
  content?: string;
};

export type UserPost = {
  id: number;
  title: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: User;
};
