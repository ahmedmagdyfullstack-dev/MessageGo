import { SendMessageInput } from "../models/message.model";
import { getProvider } from "../providers/provider.factory";
import { messageStore, StoredMessage } from "../store/message.store";
import { generateMessageId } from "../utils/id";
import { logger } from "../utils/logger";

export async function sendMessage(
  input: SendMessageInput,
): Promise<StoredMessage> {
  const id = generateMessageId();
  const now = new Date();

  const message: StoredMessage = {
    id,
    status: "accepted",
    channel: input.channel,
    to: input.to,
    content: input.content as Record<string, unknown>,
    metadata: input.metadata,
    createdAt: now,
    updatedAt: now,
  };
  messageStore.save(message);

  const provider = getProvider(input.channel);

  try {
    message.status = "processing";
    message.updatedAt = new Date();
    messageStore.save(message);

    const result = await provider.send(
      input.to,
      input.content as Record<string, unknown>,
    );

    message.status = result.status;
    message.updatedAt = new Date();
    message.providerResponse = {
      providerMessageId: result.providerMessageId,
      simulatedDeliveryTime: `${new Date().getTime() - now.getTime()}ms`,
    };
    messageStore.save(message);

    logger.info(
      `[MessageService] Message ${id} -> ${result.status} via ${input.channel}`,
    );
  } catch (error) {
    message.status = "failed";
    message.updatedAt = new Date();
    message.providerResponse = { error: (error as Error).message };
    messageStore.save(message);

    logger.error(
      `[MessageService] Message ${id} failed: ${(error as Error).message}`,
    );
  }

  return message;
}

export function getMessage(id: string): StoredMessage | undefined {
  return messageStore.get(id);
}

export function listMessages(opts?: { limit?: number; channel?: string }) {
  return messageStore.list(opts);
}
