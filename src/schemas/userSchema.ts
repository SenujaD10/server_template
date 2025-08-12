import { Schema } from "mongoose";
import { IUser } from "../interfaces";

export const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: { type: String, required: true, index: true, lowercase: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
