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

## Architecture & Decisions

### Why this stack

**Express over NestJS/Fastify:** For a v1 with three routes, Express is the right level of abstraction. NestJS adds decorators, modules, and DI that would make the project look over-engineered for what it does. Express is also the easiest for a reviewer to read without framework-specific knowledge.

**Zod over Joi/class-validator:** Zod's `discriminatedUnion` is a natural fit for our problem. Each channel has different validation rules for `to` (phone vs email) and `content` (body-only vs subject+body). With Zod, these are separate union members, so adding a new channel is adding one object to the union, nothing else changes. Zod also generates TypeScript types from schemas, so the validation and the types can't drift apart.

**In-memory Map over SQLite/file storage:** The assignment doesn't require persistence, and adding a database would add setup friction for the reviewer. The store is behind an interface (`save`, `get`, `list`, `clear`), so swapping to PostgreSQL later is a localised change in one file.

### Key design decisions

**Provider Strategy Pattern.** Each channel (email, SMS, WhatsApp) is a separate class behind a shared `MessageProvider` interface. A factory maps `channel` string to provider instance. Adding a new channel (e.g., push notifications) means: implement the interface, register in the factory. No changes to routes, validation, controllers, or service logic.

**202 Accepted, not 200 OK.** The API returns 202 even though our providers are synchronous simulations. In production, sending is async (queue -> worker -> provider). By returning 202 now, we set the right contract from day one. Clients that integrate against our v1 won't need to change anything when we move to real async processing.

**App factory for testing.** `createApp()` returns an Express app without starting a server. Tests create isolated instances via Supertest. No port conflicts, no server lifecycle management in tests.

**Simulated provider delays and failures.** Each provider has a random delay (30-280ms depending on channel) and a ~5% failure rate. This makes the API behave realistically: the status endpoint returns `delivered` or `failed`, the response times vary, and the message log shows a mix of outcomes.

### Tradeoffs

| Decision | Upside | Downside |
|----------|--------|----------|
| Synchronous send (no queue) | Simple to run and test, no infrastructure deps | In production, API response time depends on provider latency |
| In-memory store | Zero setup, fast tests, no external deps | Messages lost on restart, no query capabilities |
| No authentication | Reduces scope, easier to test and review | Can't be deployed as-is |
| Single validation layer (Zod at controller) | One place to understand all rules | No defense-in-depth if Zod is bypassed |
| Console logging over structured logging | Readable during development | Not queryable in production (would switch to pino) |

### Testing approach

**Unit tests** cover the pieces with meaningful logic:
- Schema validation (12 cases): each channel validates its own `to` format and `content` shape, rejects invalid input, accepts optional fields
- Providers (2 cases each): confirms the interface contract (returns `SendResult` with correct shape and ID prefix)

**Integration tests** cover the full HTTP path (16 cases): valid requests across all 3 channels, validation rejections (invalid phone, missing subject, unknown channel), message retrieval, listing with filters, 404 handling, health check.

32 tests total. The goal is meaningful coverage of the contract and edge cases, not maximising a coverage percentage.

## Assumptions

- Providers are simulated. When a message is "sent," the action is logged to the console with channel-specific details (recipient, subject/body preview). No real messages are delivered.
- No authentication. In production, this would use API key auth via `x-api-key` header (see Further Steps).
- No persistence. Messages are stored in memory and lost on restart.
- Single-tenant. No concept of organisations or isolated message spaces.
- Content is text-only. No attachments, media, or rich content for WhatsApp.
- The `to` field uses E.164 format for SMS/WhatsApp and standard email validation for email.

## Further Steps

See [docs/FURTHER_STEPS.md](docs/FURTHER_STEPS.md) for detailed discussion of authentication, persistence, async processing, real provider integration, webhooks, observability, idempotency, templates, and compliance.
