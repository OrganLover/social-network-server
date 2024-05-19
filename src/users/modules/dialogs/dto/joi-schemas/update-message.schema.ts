import j from 'joi';

const updateMessageSchema = j.object({
  value: j.string().required(),
});

export default updateMessageSchema;
