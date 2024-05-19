import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import DialogsService from './dialogs.service';
import DialogsContoller from './dialogs.controller';
import DialogsGateway from './dialogs.gateway';

@Module({
  controllers: [DialogsContoller],
  providers: [DialogsService, DialogsGateway, PrismaClient],
})
export class DialogsModule {}
