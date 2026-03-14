import { MessageProvider, SendResult } from "./provider.interface";
import { logger } from "../utils/logger";

export class SmsProvider implements MessageProvider {
  readonly channel = "sms";

  async send(
    to: string,
    content: Record<string, unknown>,
  ): Promise<SendResult> {
    const delay = Math.floor(Math.random() * 100) + 30;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail = Math.random() < 0.05;

    if (shouldFail) {
      logger.warn(`[SmsProvider] Simulated delivery failure to ${to}`);
      return {
        providerMessageId: `sim_sms_${Date.now()}`,
        status: "failed",
        timestamp: new Date(),
        metadata: { reason: "Simulated: number unreachable" },
      };
    }

    logger.info(
      `[SmsProvider] SMS sent to ${to} - Body: "${(content.body as string).slice(0, 50)}..."`,
    );

    return {
      providerMessageId: `sim_sms_${Date.now()}`,
      status: "delivered",
      timestamp: new Date(),
    };
  }
}
