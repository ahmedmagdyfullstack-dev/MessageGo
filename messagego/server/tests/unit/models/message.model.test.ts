import { sendMessageSchema } from "../../../src/models/message.model";

describe("sendMessageSchema", () => {
  describe("SMS", () => {
    it("should accept a valid SMS message", () => {
      const result = sendMessageSchema.safeParse({
        channel: "sms",
        to: "+12025551234",
        content: { body: "Hello from MessageGO" },
      });
      expect(result.success).toBe(true);
    });

    it("should reject SMS with invalid phone number", () => {
      const result = sendMessageSchema.safeParse({
        channel: "sms",
        to: "not-a-phone",
        content: { body: "Hello" },
      });
      expect(result.success).toBe(false);
    });

    it("should reject SMS without body", () => {
      const result = sendMessageSchema.safeParse({
        channel: "sms",
        to: "+12025551234",
        content: {},
      });
      expect(result.success).toBe(false);
    });

    it("should reject SMS with body exceeding 1600 chars", () => {
      const result = sendMessageSchema.safeParse({
        channel: "sms",
        to: "+12025551234",
        content: { body: "a".repeat(1601) },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Email", () => {
    it("should accept a valid email message", () => {
      const result = sendMessageSchema.safeParse({
        channel: "email",
        to: "user@example.com",
        content: { subject: "Test", body: "Hello" },
      });
      expect(result.success).toBe(true);
    });

    it("should accept email with optional html field", () => {
      const result = sendMessageSchema.safeParse({
        channel: "email",
        to: "user@example.com",
        content: { subject: "Test", body: "Hello", html: "<p>Hello</p>" },
      });
      expect(result.success).toBe(true);
    });

    it("should reject email with invalid address", () => {
      const result = sendMessageSchema.safeParse({
        channel: "email",
        to: "not-an-email",
        content: { subject: "Test", body: "Hello" },
      });
      expect(result.success).toBe(false);
    });

    it("should reject email without subject", () => {
      const result = sendMessageSchema.safeParse({
        channel: "email",
        to: "user@example.com",
        content: { body: "Hello" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("WhatsApp", () => {
    it("should accept a valid WhatsApp message", () => {
      const result = sendMessageSchema.safeParse({
        channel: "whatsapp",
        to: "+201234567890",
        content: { body: "Hello via WhatsApp" },
      });
      expect(result.success).toBe(true);
    });

    it("should reject WhatsApp with invalid phone number", () => {
      const result = sendMessageSchema.safeParse({
        channel: "whatsapp",
        to: "user@example.com",
        content: { body: "Hello" },
      });
      expect(result.success).toBe(false);
    });

    it("should reject WhatsApp with body exceeding 4096 chars", () => {
      const result = sendMessageSchema.safeParse({
        channel: "whatsapp",
        to: "+201234567890",
        content: { body: "a".repeat(4097) },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("General", () => {
    it("should accept optional metadata", () => {
      const result = sendMessageSchema.safeParse({
        channel: "sms",
        to: "+12025551234",
        content: { body: "Hello" },
        metadata: { orderId: "1234" },
      });
      expect(result.success).toBe(true);
    });

    it("should reject unknown channels", () => {
      const result = sendMessageSchema.safeParse({
        channel: "telegram",
        to: "+12025551234",
        content: { body: "Hello" },
      });
      expect(result.success).toBe(false);
    });
  });
});
