export interface SendResult {
  providerMessageId: string;
  status: "delivered" | "failed";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface MessageProvider {
  readonly channel: string;
  send(to: string, content: Record<string, unknown>): Promise<SendResult>;
}
