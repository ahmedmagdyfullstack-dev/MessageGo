import sgMail from "@sendgrid/mail";
import { MessageProvider, SendResult } from "./provider.interface";
import { config } from "../config";
import { logger } from "../utils/logger";

export class EmailProvider implements MessageProvider {
  readonly channel = "email";

  constructor() {
    if (config.sendgridApiKey) {
      sgMail.setApiKey(config.sendgridApiKey);
    }
  }

  async send(
    to: string,
    content: Record<string, unknown>,
  ): Promise<SendResult> {
    if (!config.sendgridApiKey || !config.sendgridFromEmail) {
      throw new Error(
        "SendGrid is not configured. Set SENDGRID_API_KEY and SENDGRID_FROM_EMAIL.",
      );
    }

    try {
      const [response] = await sgMail.send({
        to,
        from: config.sendgridFromEmail,
        subject: content.subject as string,
        text: content.body as string,
        ...(content.html ? { html: content.html as string } : {}),
      });

      const messageId = response.headers["x-message-id"] || `sg_${Date.now()}`;
      logger.info(
        `[EmailProvider] Email sent to ${to} - Subject: "${content.subject}" (ID: ${messageId})`,
      );

      return {
        providerMessageId: String(messageId),
        status: "delivered",
        timestamp: new Date(),
      };
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      logger.error(`[EmailProvider] Failed to send to ${to}: ${errMsg}`);

      return {
        providerMessageId: `sg_failed_${Date.now()}`,
        status: "failed",
        timestamp: new Date(),
        metadata: { reason: errMsg },
      };
    }
  }
}
