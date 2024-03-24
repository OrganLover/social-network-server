import type {
  UserProfile,
  ChangableUserProfileProperties,
} from '../users.interface';

export type CreateUserDto = {
  email: string;
  password: string;
  profile?: Pick<UserProfile, 'userName'>;
};

export type UpdateUserDto = {
  profile: ChangableUserProfileProperties;
};
