import express from "express";
import cors from "cors";
import { messagesRouter } from "./routes/messages.routes";
import { healthRouter } from "./routes/health.routes";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.use("/api/v1/messages", messagesRouter);
  app.use("/health", healthRouter);

  app.use(errorHandler);

  return app;
}
