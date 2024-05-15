/*
  Warnings:

  - The primary key for the `disliked_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `disliked_posts` table. All the data in the column will be lost.
  - The primary key for the `liked_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `liked_posts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `disliked_posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `liked_posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `disliked_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `liked_posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "disliked_posts" DROP CONSTRAINT "disliked_posts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "liked_posts" DROP CONSTRAINT "liked_posts_author_id_fkey";

-- DropIndex
DROP INDEX "disliked_posts_author_id_key";

-- DropIndex
DROP INDEX "liked_posts_author_id_key";

-- AlterTable
ALTER TABLE "disliked_posts" DROP CONSTRAINT "disliked_posts_pkey",
DROP COLUMN "author_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "disliked_posts_pkey" PRIMARY KEY ("user_id", "post_id");

-- AlterTable
ALTER TABLE "liked_posts" DROP CONSTRAINT "liked_posts_pkey",
DROP COLUMN "author_id",
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "liked_posts_pkey" PRIMARY KEY ("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "disliked_posts_user_id_key" ON "disliked_posts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "liked_posts_user_id_key" ON "liked_posts"("user_id");

-- AddForeignKey
ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disliked_posts" ADD CONSTRAINT "disliked_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
