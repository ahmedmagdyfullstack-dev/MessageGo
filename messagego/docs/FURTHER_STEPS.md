# Further Steps

## Authentication & Multi-Tenancy

- API key authentication via `x-api-key` header
- Keys scoped to an organisation, stored hashed
- Rate limiting per API key (e.g., 100 req/s)
- Organisation-level message isolation

## Persistence

- PostgreSQL for message storage (messages, organisations, API keys)
- Indexed by: id, organisation_id, channel, status, created_at
- Consider partitioning by created_at for high-volume clients

## Async Processing

- Current: synchronous send (provider called inline)
- Target: Accept message → enqueue to a job queue (BullMQ / SQS) → worker picks up and calls provider → status updated via callback
- Benefit: API response time is constant (~20ms) regardless of provider latency
- Status polling via GET /messages/:id still works; add webhooks for push updates

## Real Provider Integration

- Email: SendGrid, AWS SES, or Postmark (support SMTP fallback)
- SMS: Twilio or Vonage
- WhatsApp: Meta WhatsApp Business API (requires approved templates for business-initiated messages)
- Abstract via the existing provider interface — swap simulation for real SDK calls

## Webhook Delivery

- Clients register a webhook URL
- On status change (delivered, failed), POST the event to their URL
- Include HMAC signature for verification
- Retry failed webhook deliveries with exponential backoff

## Observability

- Structured logging (pino) with correlation IDs per request
- Prometheus metrics: messages_sent_total{channel, status}, provider_latency_seconds
- Distributed tracing (OpenTelemetry) for debugging provider issues
- Alerting on failure rate spikes per channel

## Idempotency

- Accept a client-provided `idempotencyKey` in the request
- Store it alongside the message; if the same key is seen again, return the original response without re-sending
- Critical for transactional messages (prevent duplicate "Your order shipped" emails)

## Template System

- Pre-defined message templates with variable substitution
- Useful for the e-commerce client: `"Your order {{orderId}} has shipped"`
- Templates could be managed via a CRUD API
- WhatsApp specifically requires pre-approved templates for business-initiated messages

## Compliance

- Message content logging controls (some clients may not want message bodies stored)
- Data retention policies and automatic purging
- Opt-out / unsubscribe handling for SMS and Email
- Audit trail for all API actions
