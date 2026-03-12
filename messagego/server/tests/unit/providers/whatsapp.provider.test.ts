jest.mock("../../../src/config", () => ({
  config: {
    twilioAccountSid: "ACtest",
    twilioAuthToken: "test-token",
    twilioWhatsAppNumber: "+14155238886",
  },
}));

jest.mock("twilio", () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        sid: "SM_wa_test_sid_456",
        status: "queued",
      }),
    },
  }));
});

import { WhatsAppProvider } from "../../../src/providers/whatsapp.provider";

describe("WhatsAppProvider", () => {
  const provider = new WhatsAppProvider();

  it('should have channel set to "whatsapp"', () => {
    expect(provider.channel).toBe("whatsapp");
  });

  it("should return a SendResult with expected shape", async () => {
    const result = await provider.send("+201234567890", {
      body: "Test WhatsApp",
    });
    expect(result.providerMessageId).toBe("SM_wa_test_sid_456");
    expect(result.status).toBe("delivered");
    expect(result).toHaveProperty("timestamp");
  });
});
