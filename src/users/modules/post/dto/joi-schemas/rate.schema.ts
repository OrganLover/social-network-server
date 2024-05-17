import j from 'joi';

const ratePostSchema = j.object({
  value: j.allow(1, -1),
  userId: j.number().positive(),
  postId: j.number().positive(),
});

export default ratePostSchema;
