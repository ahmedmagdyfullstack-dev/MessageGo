jest.mock("@sendgrid/mail", () => ({
  setApiKey: jest.fn(),
  send: jest.fn().mockResolvedValue([
    {
      statusCode: 202,
      headers: { "x-message-id": "sg-integration-test" },
      body: "",
    },
  ]),
}));

jest.mock("twilio", () => {
  return jest.fn(() => ({
    messages: {
      create: jest
        .fn()
        .mockResolvedValue({ sid: "SM_integration_test", status: "queued" }),
    },
  }));
});

jest.mock("../../src/config", () => ({
  config: {
    port: 3001,
    nodeEnv: "test",
    sendgridApiKey: "SG.test",
    sendgridFromEmail: "test@test.com",
    twilioAccountSid: "ACtest",
    twilioAuthToken: "test",
    twilioPhoneNumber: "+10000000000",
    twilioWhatsAppNumber: "+14155238886",
  },
}));

import request from "supertest";
import { createApp } from "../../src/app";
import { messageStore } from "../../src/store/message.store";

const app = createApp();

beforeEach(() => {
  messageStore.clear();
});

describe("POST /api/v1/messages", () => {
  it("should accept a valid SMS message and return 202", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+12025551234",
        channel: "sms",
        content: { body: "Hello from MessageGO" },
      });

    expect(res.status).toBe(202);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toMatch(/^msg_/);
    expect(res.body.channel).toBe("sms");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("should accept a valid email message and return 202", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "user@example.com",
        channel: "email",
        content: { subject: "Order Update", body: "Your order has shipped" },
      });

    expect(res.status).toBe(202);
    expect(res.body.channel).toBe("email");
  });

  it("should accept a valid WhatsApp message and return 202", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+201234567890",
        channel: "whatsapp",
        content: { body: "Hello via WhatsApp" },
      });

    expect(res.status).toBe(202);
    expect(res.body.channel).toBe("whatsapp");
  });

  it("should reject an invalid email address with 422", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "not-an-email",
        channel: "email",
        content: { subject: "Test", body: "Hello" },
      });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject SMS without a body", async () => {
    const res = await request(app).post("/api/v1/messages").send({
      to: "+12025551234",
      channel: "sms",
      content: {},
    });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("should reject email without a subject", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "user@example.com",
        channel: "email",
        content: { body: "Hello" },
      });

    expect(res.status).toBe(422);
  });

  it("should reject unknown channels", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+12025551234",
        channel: "telegram",
        content: { body: "Hello" },
      });

    expect(res.status).toBe(422);
  });

  it("should reject WhatsApp with invalid phone", async () => {
    const res = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "user@example.com",
        channel: "whatsapp",
        content: { body: "Hello" },
      });

    expect(res.status).toBe(422);
  });
});

describe("GET /api/v1/messages/:id", () => {
  it("should return a previously sent message", async () => {
    const sendRes = await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+12025551234",
        channel: "sms",
        content: { body: "Test message" },
      });

    const getRes = await request(app).get(
      `/api/v1/messages/${sendRes.body.id}`,
    );

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(sendRes.body.id);
    expect(getRes.body.channel).toBe("sms");
    expect(getRes.body).toHaveProperty("content");
    expect(getRes.body).toHaveProperty("providerResponse");
  });

  it("should return 404 for unknown message ID", async () => {
    const res = await request(app).get("/api/v1/messages/msg_doesnotexist");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("GET /api/v1/messages", () => {
  it("should list recent messages", async () => {
    await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+12025551234",
        channel: "sms",
        content: { body: "Message 1" },
      });
    await request(app)
      .post("/api/v1/messages")
      .send({
        to: "user@example.com",
        channel: "email",
        content: { subject: "S", body: "Message 2" },
      });

    const res = await request(app).get("/api/v1/messages");

    expect(res.status).toBe(200);
    expect(res.body.messages.length).toBe(2);
    expect(res.body.total).toBe(2);
  });

  it("should filter by channel", async () => {
    await request(app)
      .post("/api/v1/messages")
      .send({
        to: "+12025551234",
        channel: "sms",
        content: { body: "SMS" },
      });
    await request(app)
      .post("/api/v1/messages")
      .send({
        to: "user@example.com",
        channel: "email",
        content: { subject: "S", body: "Email" },
      });

    const res = await request(app).get("/api/v1/messages?channel=sms");

    expect(res.status).toBe(200);
    expect(res.body.messages.length).toBe(1);
    expect(res.body.messages[0].channel).toBe("sms");
  });
});

describe("GET /health", () => {
  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("version");
  });
});
