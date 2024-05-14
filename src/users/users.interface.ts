export type User = {
  id: number;
  email: string;
  profile: UserProfile | null;
};

export type UserProfile = {
  userId: number;
  userName: string;
  aboutMe: string | null;
  avatarPath: string | null;
};
