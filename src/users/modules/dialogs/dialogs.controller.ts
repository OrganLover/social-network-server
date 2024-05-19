import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { joiBodyValidatorDecorator } from 'libs';

import DialogsService from './dialogs.service';
import createDialogSchema from './dto/joi-schemas/create-dialog.schema';

import type { CreateDialogDto } from './dto/dialog.dto';

@Controller('dialogs')
export default class DialogsContoller {
  public constructor(private readonly service: DialogsService) {}

  @Post()
  public createDialog(
    @joiBodyValidatorDecorator(createDialogSchema) dto: CreateDialogDto,
  ) {
    return this.service.createDialog(dto);
  }

  @Get(':id')
  public getDialog(@Param('id', ParseIntPipe) id: number) {
    return this.service.getDialog(id);
  }

  @Get('by-user/:userId')
  public getUserDialogs(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.getUserDialogs(userId);
  }

  @Delete(':id')
  public deleteDialog(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteDialog(id);
  }
}
