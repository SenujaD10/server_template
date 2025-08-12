import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import { StatusCodes } from "http-status-codes";
import { startServer } from "./server/server";
import { errorHandler } from "./controllers/errorController";
import { authRouter } from "./routers/authRouter";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(
  cors({
    origin: "*", // change this later
  })
);
app.use(
  morgan("dev", {
    skip: (req, res) => {
      return res.statusCode < StatusCodes.BAD_REQUEST;
    },
  })
);
app.use("/api/v1/auth", authRouter);
app.use(errorHandler);

// test end point
app.get("/api/v1/test", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API running." });
});

startServer(app);
