import { FlattenMaps, Types } from "mongoose";
import { RequestUser } from "../../interfaces";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
    }
  }
}
