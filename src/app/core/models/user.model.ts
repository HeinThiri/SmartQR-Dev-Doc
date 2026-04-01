export interface User {
  username: string;
  passwordHash: string;
  displayName: string;
  role: 'admin' | 'viewer';
}

export interface SessionUser {
  username: string;
  displayName: string;
  role: string;
  token: string;
}
