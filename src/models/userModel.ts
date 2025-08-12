import { model } from "mongoose";
import { userSchema } from "../schemas/userSchema";
import { IUser } from "../interfaces";

export const User = model<IUser>("User", userSchema)