export interface GoogleAuthPayload {
  idToken: string;
}

export interface AuthResult {
  token: string;
  user: {
    userId: number;
    username: string | null;
    email: string | null;
    avatar: string | null;
    roleId: number;
  };
}
