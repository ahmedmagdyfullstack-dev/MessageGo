jest.mock("../../../src/config", () => ({
  config: {
    twilioAccountSid: "ACtest",
    twilioAuthToken: "test-token",
    twilioPhoneNumber: "+10000000000",
  },
}));

jest.mock("twilio", () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        sid: "SM_test_sid_123",
        status: "queued",
      }),
    },
  }));
});

import { SmsProvider } from "../../../src/providers/sms.provider";

describe("SmsProvider", () => {
  const provider = new SmsProvider();

  it('should have channel set to "sms"', () => {
    expect(provider.channel).toBe("sms");
  });

  it("should return a SendResult with expected shape", async () => {
    const result = await provider.send("+12025551234", { body: "Test SMS" });
    expect(result.providerMessageId).toBe("SM_test_sid_123");
    expect(result.status).toBe("delivered");
    expect(result).toHaveProperty("timestamp");
  });
});
