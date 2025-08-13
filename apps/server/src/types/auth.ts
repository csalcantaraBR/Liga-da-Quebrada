export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastActive: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}
