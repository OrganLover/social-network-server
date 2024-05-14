-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN "id" SERIAL NOT NULL,
ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "user_posts" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "dislikes_count" INTEGER NOT NULL DEFAULT 0,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "user_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_posts" (
    "author_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "liked_posts_pkey" PRIMARY KEY ("author_id","post_id")
);

-- CreateTable
CREATE TABLE "disliked_posts" (
    "author_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "disliked_posts_pkey" PRIMARY KEY ("author_id","post_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "liked_posts_author_id_key" ON "liked_posts"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "liked_posts_post_id_key" ON "liked_posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "disliked_posts_author_id_key" ON "disliked_posts"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "disliked_posts_post_id_key" ON "disliked_posts"("post_id");

-- AddForeignKey
ALTER TABLE "user_posts" ADD CONSTRAINT "user_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_posts" ADD CONSTRAINT "liked_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "user_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disliked_posts" ADD CONSTRAINT "disliked_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disliked_posts" ADD CONSTRAINT "disliked_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "user_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
