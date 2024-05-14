import j from 'joi';

const updateUserPostSchema = j.object({
  title: j.string().max(50).optional(),
  content: j.string().max(1000).optional(),
});

export default updateUserPostSchema;
