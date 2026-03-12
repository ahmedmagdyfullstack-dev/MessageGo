export interface StoredMessage {
  id: string;
  status: "accepted" | "processing" | "delivered" | "failed";
  channel: string;
  to: string;
  content: Record<string, unknown>;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  providerResponse?: Record<string, unknown>;
}

class MessageStore {
  private messages = new Map<string, StoredMessage>();

  save(message: StoredMessage): void {
    this.messages.set(message.id, { ...message });
  }

  get(id: string): StoredMessage | undefined {
    return this.messages.get(id);
  }

  list(opts?: { limit?: number; channel?: string }): {
    messages: StoredMessage[];
    total: number;
  } {
    let all = Array.from(this.messages.values());

    if (opts?.channel) {
      all = all.filter((m) => m.channel === opts.channel);
    }

    all.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = all.length;
    const limited = all.slice(0, opts?.limit ?? 50);

    return { messages: limited, total };
  }

  clear(): void {
    this.messages.clear();
  }
}

export const messageStore = new MessageStore();
