import j from 'joi';

export const registerUserSchema = j.object({
  email: j.string().max(255).required(),
  password: j.string().min(8).required(),
  userName: j.string().optional(),
});

export const loginUserSchema = j.object({
  email: j.string().max(255).required(),
  password: j.string().min(8).required(),
});
