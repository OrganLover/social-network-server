-- CreateTable
CREATE TABLE "dialogs" (
    "id" SERIAL NOT NULL,
    "initiator_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "dialogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "dialog_id" INTEGER NOT NULL,
    "writer_id" INTEGER NOT NULL,
    "reader_id" INTEGER NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dialogs_initiator_id_user_id_key" ON "dialogs"("initiator_id", "user_id");

-- AddForeignKey
ALTER TABLE "dialogs" ADD CONSTRAINT "dialogs_initiator_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dialogs" ADD CONSTRAINT "dialogs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_dialog_id_fkey" FOREIGN KEY ("dialog_id") REFERENCES "dialogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reader_id_fkey" FOREIGN KEY ("reader_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
