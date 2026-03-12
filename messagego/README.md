# MessageGO

Unified messaging API for Email, WhatsApp, and SMS.

## Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### Run the API

```bash
cd server
npm install
npm run dev
# → http://localhost:3001
```

### Run the Playground

```bash
cd playground
npm install
npm run dev
# → http://localhost:5173
```

### Run Tests

```bash
cd server
npm test
```

## API Reference

### `POST /api/v1/messages` - Send a message

**Request body (SMS):**

```json
{
  "to": "+12025551234",
  "channel": "sms",
  "content": { "body": "Your order #1234 has been shipped!" },
  "metadata": { "orderId": "1234" }
}
```

**Request body (Email):**

```json
{
  "to": "user@example.com",
  "channel": "email",
  "content": {
    "subject": "Order Update",
    "body": "Your order has shipped.",
    "html": "<p>Your order has shipped.</p>"
  }
}
```

**Request body (WhatsApp):**

```json
{
  "to": "+201234567890",
  "channel": "whatsapp",
  "content": { "body": "Your order #1234 has been shipped!" }
}
```

**Response (202 Accepted):**

```json
{
  "id": "msg_a1b2c3d4e5f6",
  "status": "accepted",
  "channel": "sms",
  "to": "+12025551234",
  "createdAt": "2026-03-12T14:30:00.000Z"
}
```

**Error response (422):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "to", "message": "Must be a valid E.164 phone number" }
    ]
  }
}
```

### `GET /api/v1/messages/:id` - Get message status

Returns the full message object including content, metadata, provider response, and timestamps.

### `GET /api/v1/messages` - List recent messages

Query params: `?limit=20&channel=sms`

Returns `{ messages: [...], total: 42 }`.

### `GET /health` - Health check

Returns `{ status: "ok", uptime: 12345, version: "1.0.0" }`.

## Architecture

### Design Decisions

1. **Provider Strategy Pattern**: Each messaging channel is implemented as a separate provider behind a common interface (`MessageProvider`). Adding a new channel (e.g., push notifications) requires implementing one interface and registering it in the factory - no changes to routing, validation, or business logic.

2. **Discriminated Union Validation (Zod)**: The request schema uses Zod's `discriminatedUnion` on the `channel` field. Each channel validates its own `to` format and `content` shape independently. An SMS with an email address in `to` is rejected at the schema level, not in business logic.

3. **202 Accepted (not 200 OK)**: The API returns 202 because message sending is conceptually asynchronous - even though our simulation is synchronous. This communicates the right contract to API consumers and makes the transition to a real async architecture (queues, webhooks) non-breaking.

4. **App Factory Pattern**: The Express app is created via a factory function (`createApp()`), so tests can create isolated instances without starting a real HTTP server.

5. **In-Memory Store**: Messages are stored in a Map for simplicity. The store is behind a clean interface, so swapping to PostgreSQL or Redis is a localised change.

## Assumptions

- No real message delivery - providers simulate sending with random delays and a ~5% failure rate
- No authentication required for v1 (see Further Steps)
- No persistence - messages are lost on restart
- Single-tenant - no concept of organisations or API keys
- Content is text-only - no attachments, media, or rich content for WhatsApp

## Further Steps

See [docs/FURTHER_STEPS.md](docs/FURTHER_STEPS.md) for detailed discussion of authentication, persistence, async processing, real provider integration, webhooks, observability, idempotency, templates, and compliance.
