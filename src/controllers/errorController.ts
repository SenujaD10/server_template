import { GeneralError } from "../errors/errors";
import { type Request, type Response, type NextFunction } from "express";

export const errorHandler = async (
  err: GeneralError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    error: {
      name: err.name,
      message,
    },
  });
};
