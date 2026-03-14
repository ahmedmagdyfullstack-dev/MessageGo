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
    expect(result).toHaveProperty("providerMessageId");
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("timestamp");
    expect(["delivered", "failed"]).toContain(result.status);
    expect(result.providerMessageId).toMatch(/^sim_wa_/);
  });
});
