import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { UserJwtPayload } from "../interfaces";

const ACCESS_TOKEN_KEY = process.env.APP_ACCESS_TOKEN_KEY;
const REFRESH_TOKEN_KEY = process.env.APP_REFRESH_TOKEN_KEY;

export const getAccessToken = (userId: Types.ObjectId) => {
  if (!ACCESS_TOKEN_KEY) {
    throw new Error("Environment variable ACCESS_TOKEN_KEY is undefined.");
  }

  return jwt.sign({ userId }, ACCESS_TOKEN_KEY, { expiresIn: "30m" });
};

export const getRefreshToken = (userId: Types.ObjectId) => {
  if (!REFRESH_TOKEN_KEY) {
    throw new Error("Environment variable ACCESS_TOKEN_KEY is undefined.");
  }

  return jwt.sign({ userId }, REFRESH_TOKEN_KEY, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  if (!ACCESS_TOKEN_KEY) {
    throw new Error("Environment variable ACCESS_TOKEN_KEY is undefined.");
  }
  return jwt.verify(token, ACCESS_TOKEN_KEY) as UserJwtPayload;
};
export const verifyRefreshToken = (token: string) => {
  if (!REFRESH_TOKEN_KEY) {
    throw new Error("Environment variable ACCESS_TOKEN_KEY is undefined.");
  }
  return jwt.verify(token, REFRESH_TOKEN_KEY) as UserJwtPayload;
};
