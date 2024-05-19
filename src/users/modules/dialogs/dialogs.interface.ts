import type { User } from '@prisma/client';

export type Dialog = {
  id: number;
  messages: Message[];
  initiator: User;
  respondent: User;
};

export type Dialogs = Omit<Dialog, 'messages'>[];

export type Message = {
  id: number;
  value: string;
  writer: User;
  reader: User;
  createdAt: Date;
  updatedAt: Date;
};
