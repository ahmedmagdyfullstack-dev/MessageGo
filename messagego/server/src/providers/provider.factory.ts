import { MessageProvider } from "./provider.interface";
import { EmailProvider } from "./email.provider";
import { SmsProvider } from "./sms.provider";
import { WhatsAppProvider } from "./whatsapp.provider";

const providers: Record<string, MessageProvider> = {
  email: new EmailProvider(),
  sms: new SmsProvider(),
  whatsapp: new WhatsAppProvider(),
};

export function getProvider(channel: string): MessageProvider {
  const provider = providers[channel];
  if (!provider) {
    throw new Error(`Unsupported channel: ${channel}`);
  }
  return provider;
}
