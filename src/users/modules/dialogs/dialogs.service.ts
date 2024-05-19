import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import type { Socket } from 'socket.io';
import type { Dialog, Dialogs } from './dialogs.interface';
import type {
  CreateDialogDto,
  CreateMessageDto,
  UpdateMessageDto,
} from './dto/dialog.dto';

@Injectable()
export default class DialogsService {
  public clients: Map<number, Socket> = new Map();

  public constructor(private readonly db: PrismaClient) {}

  public async createDialog(dto: CreateDialogDto): Promise<Dialog> {
    const dialog = await this.db.dialog.findUnique({
      where: {
        initiatorId_respondentId: {
          initiatorId: dto.initiatorId,
          respondentId: dto.respondentId,
        },
      },
      include: {
        messages: {
          include: {
            reader: true,
            writer: true,
          },
        },
        initiator: {
          include: {
            profile: true,
          },
        },
        respondent: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (dialog) {
      if (!dto.firstMessage) {
        return dialog;
      }

      if (dto.firstMessage) {
        await this.db.message.create({
          data: {
            value: dto.firstMessage,
            dialog: { connect: { id: dialog.id } },
            writer: { connect: { id: dialog.initiatorId } },
            reader: { connect: { id: dialog.respondentId } },
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return await this.db.dialog.findUnique({
        where: {
          id: dialog.id,
        },
      });
    }

    let createdDialog = await this.db.dialog.create({
      data: {
        initiator: { connect: { id: dto.initiatorId } },
        respondent: { connect: { id: dto.respondentId } },
      },
      include: {
        messages: {
          include: {
            writer: true,
            reader: true,
          },
        },
        initiator: {
          include: {
            profile: true,
          },
        },
        respondent: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (dto.firstMessage) {
      await this.db.message.create({
        data: {
          value: dto.firstMessage,
          dialog: { connect: { id: createdDialog.id } },
          writer: { connect: { id: createdDialog.initiatorId } },
          reader: { connect: { id: createdDialog.respondentId } },
        },
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      createdDialog = await this.db.dialog.findUnique({
        where: { id: createdDialog.id },
        include: {
          messages: {
            include: {
              writer: true,
              reader: true,
            },
          },
          initiator: {
            include: {
              profile: true,
            },
          },
          respondent: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    return createdDialog;
  }

  public async getDialog(id: number): Promise<Dialog | undefined> {
    const dialog = await this.db.dialog.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            writer: true,
            reader: true,
          },
        },
        initiator: {
          include: {
            profile: true,
          },
        },
        respondent: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!dialog) {
      return undefined;
    }

    return dialog;
  }

  public async getUserDialogs(userId: number): Promise<Dialogs> {
    return await this.db.dialog.findMany({
      where: {
        OR: [
          {
            initiatorId: userId,
          },
          {
            respondentId: userId,
          },
        ],
      },
      include: {
        initiator: {
          include: {
            profile: true,
          },
        },
        respondent: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  public async deleteDialog(id: number): Promise<Dialog | undefined> {
    const deletedDialog = await this.db.dialog.delete({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            writer: true,
            reader: true,
          },
        },
        initiator: {
          include: {
            profile: true,
          },
        },
        respondent: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!deletedDialog) {
      return undefined;
    }

    return deletedDialog;
  }

  public async createMessage(dto: CreateMessageDto) {
    const createdMessage = await this.db.message.create({
      data: {
        value: dto.value,
        dialog: { connect: { id: dto.dialogId } },
        writer: { connect: { id: dto.writerId } },
        reader: { connect: { id: dto.readerId } },
      },
      include: {
        writer: {
          include: {
            profile: true,
          },
        },
        reader: {
          include: {
            profile: true,
          },
        },
      },
    });

    const writerSocket = this.clients.get(createdMessage.writerId);
    const readerSocket = this.clients.get(createdMessage.readerId);

    writerSocket?.emit('message_new', createdMessage);
    readerSocket?.emit('message_new', createdMessage);
  }

  public async updateMessage(dto: UpdateMessageDto, client: Socket) {
    const updateMessage = await this.db.message.update({
      where: {
        id: dto.id,
      },
      data: {
        value: dto.value,
      },
      include: {
        writer: {
          include: {
            profile: true,
          },
        },
        reader: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!updateMessage) {
      return client.emit('message_edit_error', 'can not update message');
    }

    const writerSocket = this.clients.get(updateMessage.writerId);
    const readerSocket = this.clients.get(updateMessage.readerId);

    writerSocket?.emit('message_edit', updateMessage);
    readerSocket?.emit('message_edit', updateMessage);
  }

  public async deleteMessage(id: number, client: Socket) {
    const deletedMessage = await this.db.message.delete({
      where: {
        id,
      },
      include: {
        writer: {
          include: {
            profile: true,
          },
        },
        reader: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!deletedMessage) {
      return client.emit('message_delete_error', 'can not delete message');
    }

    const writerSocket = this.clients.get(deletedMessage.writerId);
    const readerSocket = this.clients.get(deletedMessage.readerId);

    writerSocket?.emit('message_delete', deletedMessage);
    readerSocket?.emit('message_delete', deletedMessage);
  }

  public saveClient(_userId: string, client: Socket) {
    const userId = Number.parseInt(_userId);

    this.clients.set(userId, client);
  }
}
