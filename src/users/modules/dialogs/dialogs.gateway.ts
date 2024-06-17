import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import DialogsService from './dialogs.service';
import createMessageSchema from './dto/joi-schemas/create-message.schema';
import updateMessageSchema from './dto/joi-schemas/update-message.schema';

import type { Server, Socket } from 'socket.io';
import type { CreateMessageDto, UpdateMessageDto } from './dto/dialog.dto';

@WebSocketGateway(Number.parseInt(process.env.DIALOGS_GATEWAY_PORT ?? '4444'), {
  namespace: 'dialogs-server',
  transports: ['websocket'],
  cors: {
    origin: process.env.ORIGIN?.split(', '),
  },
})
export default class DialogsGateway {
  public constructor(private readonly service: DialogsService) {}

  @WebSocketServer()
  private server!: Server;

  handleConnection(client: Socket) {
    this.service.saveClient(client.handshake.query.userId as string, client);
  }

  @SubscribeMessage('create-message')
  public createMessage(
    @MessageBody() dto: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    const { error, value } = createMessageSchema.validate(dto);

    if (error) {
      return client.emit('validation_error', {
        message: error.details[0].message,
      });
    }

    this.service.createMessage(value as CreateMessageDto);
  }

  @SubscribeMessage('edit-message')
  public updateMessage(
    @MessageBody() dto: unknown,
    @ConnectedSocket() client: Socket,
  ) {
    const { error, value } = updateMessageSchema.validate(dto);

    if (error) {
      return client.emit('validation_error', {
        message: error.details[0].message,
      });
    }

    this.service.updateMessage(value as UpdateMessageDto, client);
  }

  @SubscribeMessage('delete-message')
  public deleteMessage(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.service.deleteMessage(id, client);
  }
}
