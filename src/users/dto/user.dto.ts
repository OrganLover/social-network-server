export type CreateUserDto = {
  email: string;
  password: string;
  userName?: string;
};

export type UpdateUserDto = {
  id: number;
  userName?: string;
  aboutMe?: string | null;
  avatarPath?: string | null;
};
