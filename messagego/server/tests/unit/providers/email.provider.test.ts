jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest
    .fn()
    .mockResolvedValue([
      {
        statusCode: 202,
        headers: { "x-message-id": "test-sg-id-123" },
        body: "",
      },
    ]),
}));

jest.mock("../../../src/config", () => ({
  config: {
    sendgridApiKey: "SG.test-key",
    sendgridFromEmail: "test@example.com",
  },
}));

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
    expect(result.providerMessageId).toBe("test-sg-id-123");
    expect(result.status).toBe("delivered");
    expect(result).toHaveProperty("timestamp");
  });
});
