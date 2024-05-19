import j from 'joi';

const createMessageSchema = j.object({
  value: j.string().required(),
  dialogId: j.number().positive().required(),
  writerId: j.number().positive().required(),
  readerId: j.number().positive().required(),
});

export default createMessageSchema;
