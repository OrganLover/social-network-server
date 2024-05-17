import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import type {
  CreateUserPostDto,
  RatePostDto,
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
        author: {
          include: {
            profile: true,
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
        dislikedBy: {
          select: {
            userId: true,
          },
        },
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
        author: {
          include: {
            profile: true,
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
        dislikedBy: {
          select: {
            userId: true,
          },
        },
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

  public async getMany(authorId: number): Promise<
    (UserPost & {
      likedBy: { userId: number }[];
      dislikedBy: { userId: number }[];
    })[]
  > {
    const posts = await this.db.userPost.findMany({
      where: {
        authorId,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        likedBy: {
          select: {
            userId: true,
          },
        },
        dislikedBy: {
          select: {
            userId: true,
          },
        },
      },
    });

    return posts;
  }

  public async ratePost(dto: RatePostDto): Promise<UserPost> {
    const alreadyLiked = await this.db.likedPost.count({
      where: {
        userId: dto.userId,
        postId: dto.postId,
      },
    });
    const alreadyDisliked = await this.db.dislikedPost.count({
      where: {
        userId: dto.userId,
        postId: dto.postId,
      },
    });

    if (dto.value === 1) {
      if (alreadyLiked) {
        const [, post] = await this.db.$transaction([
          this.db.likedPost.delete({
            where: {
              userId_postId: {
                userId: dto.userId,
                postId: dto.postId,
              },
            },
          }),

          this.db.userPost.update({
            where: {
              id: dto.postId,
            },
            data: {
              likesCount: {
                decrement: 1,
              },
            },
            include: {
              author: {
                include: {
                  profile: true,
                },
              },
              likedBy: {
                select: {
                  userId: true,
                },
              },
              dislikedBy: {
                select: {
                  userId: true,
                },
              },
            },
          }),
        ]);

        return post;
      }

      const [, , post] = await this.db.$transaction([
        this.db.likedPost.create({
          data: {
            user: {
              connect: { id: dto.userId },
            },
            post: {
              connect: { id: dto.postId },
            },
          },
        }),

        this.db.dislikedPost.deleteMany({
          where: {
            userId: dto.userId,
            postId: dto.postId,
          },
        }),

        this.db.userPost.update({
          where: {
            id: dto.postId,
          },
          data: {
            likesCount: {
              increment: 1,
            },
            dislikesCount: {
              decrement: alreadyDisliked ? 1 : 0,
            },
          },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            likedBy: {
              select: {
                userId: true,
              },
            },
            dislikedBy: {
              select: {
                userId: true,
              },
            },
          },
        }),
      ]);

      return post;
    }

    if (alreadyDisliked) {
      const [, post] = await this.db.$transaction([
        this.db.dislikedPost.delete({
          where: {
            userId_postId: {
              userId: dto.userId,
              postId: dto.postId,
            },
          },
        }),

        this.db.userPost.update({
          where: {
            id: dto.postId,
          },
          data: {
            dislikesCount: {
              decrement: 1,
            },
          },
          include: {
            author: {
              include: {
                profile: true,
              },
            },
            likedBy: {
              select: {
                userId: true,
              },
            },
            dislikedBy: {
              select: {
                userId: true,
              },
            },
          },
        }),
      ]);

      return post;
    }

    const [, , post] = await this.db.$transaction([
      this.db.dislikedPost.create({
        data: {
          user: {
            connect: { id: dto.userId },
          },
          post: {
            connect: { id: dto.postId },
          },
        },
      }),

      this.db.likedPost.deleteMany({
        where: {
          userId: dto.userId,
          postId: dto.postId,
        },
      }),

      this.db.userPost.update({
        where: {
          id: dto.postId,
        },
        data: {
          dislikesCount: {
            increment: 1,
          },
          likesCount: {
            decrement: alreadyLiked ? 1 : 0,
          },
        },
        include: {
          author: {
            include: {
              profile: true,
            },
          },
          likedBy: {
            select: {
              userId: true,
            },
          },
          dislikedBy: {
            select: {
              userId: true,
            },
          },
        },
      }),
    ]);

    return post;
  }
}
