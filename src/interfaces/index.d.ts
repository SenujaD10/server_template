import { Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserJwtPayload {
  userId: string;
  iat: number;
  exp: number;
}
