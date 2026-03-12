import twilio from "twilio";
import { MessageProvider, SendResult } from "./provider.interface";
import { config } from "../config";
import { logger } from "../utils/logger";

export class WhatsAppProvider implements MessageProvider {
  readonly channel = "whatsapp";
  private client: twilio.Twilio | null = null;

  constructor() {
    if (config.twilioAccountSid && config.twilioAuthToken) {
      this.client = twilio(config.twilioAccountSid, config.twilioAuthToken);
    }
  }

  async send(
    to: string,
    content: Record<string, unknown>,
  ): Promise<SendResult> {
    if (!this.client || !config.twilioWhatsAppNumber) {
      throw new Error(
        "Twilio WhatsApp is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_NUMBER.",
      );
    }

    try {
      const message = await this.client.messages.create({
        to: `whatsapp:${to}`,
        from: `whatsapp:${config.twilioWhatsAppNumber}`,
        body: content.body as string,
      });

      logger.info(
        `[WhatsAppProvider] WhatsApp sent to ${to} (SID: ${message.sid})`,
      );

      return {
        providerMessageId: message.sid,
        status:
          message.status === "failed" || message.status === "undelivered"
            ? "failed"
            : "delivered",
        timestamp: new Date(),
      };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      logger.error(`[WhatsAppProvider] Failed to send to ${to}: ${errMsg}`);

      return {
        providerMessageId: `twilio_wa_failed_${Date.now()}`,
        status: "failed",
        timestamp: new Date(),
        metadata: { reason: errMsg },
      };
    }
  }
}
