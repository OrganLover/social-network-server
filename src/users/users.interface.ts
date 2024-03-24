export type User = {
  id: number;
  email: string;
  passwordHash: string;
  profile: UserProfile | null;
};

export type UserProfile = {
  userId: number;
  userName: string;
  aboutMe: string | null;
  avatarPath: string | null;
};

export type ChangableUserProfileProperties = Partial<
  Omit<UserProfile, 'userId'>
>;
