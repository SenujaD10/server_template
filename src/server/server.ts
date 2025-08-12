import { type Express } from "express";
import { logger } from "../utils/logger";
import { connect } from "mongoose";

export const startServer = async (app: Express) => {
  const PORT = process.env.APP_PORT;
  const DB_URI = process.env.APP_DB_URI;

  try {
    if (!PORT) throw new Error("Environment variable APP_PORT is undefined.");
    if (!DB_URI) throw new Error("Environment variable DB_URI is undefined.");

    logger.info("Conneting to database...");
    await connect(DB_URI);
    logger.info("Connected to database.");

    logger.info("Server starting...");
    app.listen(PORT, () =>
      logger.info(`Server running: http://localhost:${PORT}/api/v1/test`)
    );
  } catch (e) {
    logger.error(e);
  }
};
