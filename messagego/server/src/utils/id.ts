export function generateMessageId(): string {
  return `msg_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}
