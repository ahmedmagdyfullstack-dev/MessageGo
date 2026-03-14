import { MessageProvider, SendResult } from "./provider.interface";
import { logger } from "../utils/logger";

export class EmailProvider implements MessageProvider {
  readonly channel = "email";

  async send(
    to: string,
    content: Record<string, unknown>,
  ): Promise<SendResult> {
    const delay = Math.floor(Math.random() * 150) + 50;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail = Math.random() < 0.05;

    if (shouldFail) {
      logger.warn(`[EmailProvider] Simulated delivery failure to ${to}`);
      return {
        providerMessageId: `sim_email_${Date.now()}`,
        status: "failed",
        timestamp: new Date(),
        metadata: { reason: "Simulated: mailbox full" },
      };
    }

    logger.info(
      `[EmailProvider] Email sent to ${to} - Subject: "${content.subject}"`,
    );

    return {
      providerMessageId: `sim_email_${Date.now()}`,
      status: "delivered",
      timestamp: new Date(),
    };
  }
}
