import { MessageProvider, SendResult } from "./provider.interface";
import { logger } from "../utils/logger";

export class WhatsAppProvider implements MessageProvider {
  readonly channel = "whatsapp";

  async send(
    to: string,
    content: Record<string, unknown>,
  ): Promise<SendResult> {
    const delay = Math.floor(Math.random() * 200) + 80;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const shouldFail = Math.random() < 0.05;

    if (shouldFail) {
      logger.warn(`[WhatsAppProvider] Simulated delivery failure to ${to}`);
      return {
        providerMessageId: `sim_wa_${Date.now()}`,
        status: "failed",
        timestamp: new Date(),
        metadata: { reason: "Simulated: recipient not on WhatsApp" },
      };
    }

    logger.info(
      `[WhatsAppProvider] WhatsApp sent to ${to} - Body: "${(content.body as string).slice(0, 50)}..."`,
    );

    return {
      providerMessageId: `sim_wa_${Date.now()}`,
      status: "delivered",
      timestamp: new Date(),
    };
  }
}
