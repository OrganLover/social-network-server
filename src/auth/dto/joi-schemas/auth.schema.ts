import j from 'joi';

export const registerUserSchema = j.object({
  email: j.string().max(255).required(),
  password: j.string().min(8).required(),
  profile: j
    .object({
      userName: j.string().optional(),
    })
    .optional(),
});

export const loginUserSchema = j.object({
  email: j.string().max(255).required(),
  password: j.string().min(8).required(),
});
