import { createApp } from "./app";
import { config } from "./config";
import { logger } from "./utils/logger";

const app = createApp();

app.listen(config.port, () => {
  logger.info(`MessageGO API running on http://localhost:${config.port}`);
  logger.info(`Health check: http://localhost:${config.port}/health`);
});
