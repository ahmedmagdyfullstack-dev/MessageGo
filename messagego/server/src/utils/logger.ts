type LogLevel = "info" | "warn" | "error" | "debug";

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level.toUpperCase()} ${message}`;
}

export const logger = {
  info(message: string): void {
    console.log(formatMessage("info", message));
  },
  warn(message: string): void {
    console.warn(formatMessage("warn", message));
  },
  error(message: string, stack?: string): void {
    console.error(formatMessage("error", message));
    if (stack) console.error(stack);
  },
  debug(message: string): void {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatMessage("debug", message));
    }
  },
};
