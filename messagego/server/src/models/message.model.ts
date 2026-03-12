import { z } from "zod";

const e164Phone = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, "Must be a valid E.164 phone number");

const smsContent = z.object({
  body: z
    .string()
    .min(1, "Body is required")
    .max(1600, "SMS body must be at most 1600 characters"),
});

const emailContent = z.object({
  subject: z.string().min(1, "Subject is required").max(998),
  body: z.string().min(1, "Body is required"),
  html: z.string().optional(),
});

const whatsappContent = z.object({
  body: z
    .string()
    .min(1, "Body is required")
    .max(4096, "WhatsApp body must be at most 4096 characters"),
});

export const channelEnum = z.enum(["email", "sms", "whatsapp"]);
export type Channel = z.infer<typeof channelEnum>;

export const sendMessageSchema = z.discriminatedUnion("channel", [
  z.object({
    channel: z.literal("sms"),
    to: e164Phone,
    content: smsContent,
    metadata: z.record(z.string()).optional(),
  }),
  z.object({
    channel: z.literal("email"),
    to: z.string().email("Must be a valid email address"),
    content: emailContent,
    metadata: z.record(z.string()).optional(),
  }),
  z.object({
    channel: z.literal("whatsapp"),
    to: e164Phone,
    content: whatsappContent,
    metadata: z.record(z.string()).optional(),
  }),
]);

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
