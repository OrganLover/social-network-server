import j from 'joi';

const updateUserSchema = j.object({
  userName: j.string().optional(),
  aboutMe: j.string().min(0).optional(),
  avatarPath: j.string().optional(),
});

export default updateUserSchema;
