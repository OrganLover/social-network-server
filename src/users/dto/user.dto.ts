import type { ChangableUserProfileProperties } from '../users.interface';

export type CreateUserDto = {
  email: string;
  password: string;
  userName?: string;
};

export type UpdateUserDto = {
  profile: ChangableUserProfileProperties;
};
