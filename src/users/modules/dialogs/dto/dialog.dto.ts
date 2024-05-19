export type CreateDialogDto = {
  initiatorId: number;
  respondentId: number;
  firstMessage?: string;
};

export type CreateMessageDto = {
  dialogId: number;
  writerId: number;
  readerId: number;
  value: string;
};

export type UpdateMessageDto = {
  id: number;
  value: string;
};
