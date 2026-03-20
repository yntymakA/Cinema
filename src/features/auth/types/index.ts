export type UserRole = 'user' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string | null;
  photoURL: string | null;
}
