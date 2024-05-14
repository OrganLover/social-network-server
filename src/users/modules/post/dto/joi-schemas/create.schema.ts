import j from 'joi';

const createUserPostSchema = j.object({
  authorId: j.number().positive().required(),
  title: j.string().max(50).required(),
  content: j.string().max(1000).required(),
});

export default createUserPostSchema;
