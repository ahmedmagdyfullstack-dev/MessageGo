import { SmsProvider } from "../../../src/providers/sms.provider";

describe("SmsProvider", () => {
  const provider = new SmsProvider();

  it('should have channel set to "sms"', () => {
    expect(provider.channel).toBe("sms");
  });

  it("should return a SendResult with expected shape", async () => {
    const result = await provider.send("+12025551234", { body: "Test SMS" });
    expect(result).toHaveProperty("providerMessageId");
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("timestamp");
    expect(["delivered", "failed"]).toContain(result.status);
    expect(result.providerMessageId).toMatch(/^sim_sms_/);
  });
});
