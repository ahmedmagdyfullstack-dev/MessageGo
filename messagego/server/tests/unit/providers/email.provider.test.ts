import { EmailProvider } from "../../../src/providers/email.provider";

describe("EmailProvider", () => {
  const provider = new EmailProvider();

  it('should have channel set to "email"', () => {
    expect(provider.channel).toBe("email");
  });

  it("should return a SendResult with expected shape", async () => {
    const result = await provider.send("user@example.com", {
      subject: "Test",
      body: "Hello",
    });
    expect(result).toHaveProperty("providerMessageId");
    expect(result).toHaveProperty("status");
    expect(result).toHaveProperty("timestamp");
    expect(["delivered", "failed"]).toContain(result.status);
    expect(result.providerMessageId).toMatch(/^sim_email_/);
  });
});
