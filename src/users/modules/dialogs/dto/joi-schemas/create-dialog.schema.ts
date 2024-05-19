import j from 'joi';

const createDialogSchema = j.object({
  initiatorId: j.number().positive().required(),
  respondentId: j.number().positive().required(),
  firstMessage: j.string().optional(),
});

export default createDialogSchema;
