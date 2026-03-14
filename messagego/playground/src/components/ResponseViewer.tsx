interface ResponseData {
  id?: string;
  status?: string;
  channel?: string;
  to?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: Record<string, unknown>;
  metadata?: Record<string, string>;
  providerResponse?: Record<string, unknown>;
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ field: string; message: string }>;
  };
}

interface Props {
  response: unknown;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

function ChannelIcon({ channel }: { channel: string }) {
  const icons: Record<string, string> = { sms: 'SMS', email: 'Email', whatsapp: 'WhatsApp' };
  return <span className="channel-label">{icons[channel] || channel}</span>;
}

export default function ResponseViewer({ response }: Props) {
  if (!response) {
    return (
      <div className="response-viewer">
        <h2>Result</h2>
        <div className="response-empty">
          <p>Send a message to see the result here.</p>
          <p className="hint">You can also click any row in the message history below to view its details.</p>
        </div>
      </div>
    );
  }

  const data = response as ResponseData;

  if (data.error) {
    return (
      <div className="response-viewer">
        <h2>Result</h2>
        <div className="response-card response-error">
          <div className="response-row">
            <span className="response-label">Error</span>
            <span className="badge badge-failed">{data.error.code}</span>
          </div>
          <div className="response-row">
            <span className="response-label">Message</span>
            <span>{data.error.message}</span>
          </div>
          {data.error.details && data.error.details.length > 0 && (
            <div className="error-details">
              {data.error.details.map((d, i) => (
                <div key={i} className="error-detail-item">
                  <strong>{d.field}:</strong> {d.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="response-viewer">
      <h2>Result</h2>
      <div className="response-card">
        <div className="response-row">
          <span className="response-label">Status</span>
          <StatusBadge status={data.status || 'unknown'} />
        </div>
        <div className="response-row">
          <span className="response-label">Channel</span>
          <ChannelIcon channel={data.channel || ''} />
        </div>
        <div className="response-row">
          <span className="response-label">To</span>
          <span>{data.to}</span>
        </div>
        <div className="response-row">
          <span className="response-label">Message ID</span>
          <span className="mono">{data.id}</span>
        </div>
        {data.createdAt && (
          <div className="response-row">
            <span className="response-label">Sent at</span>
            <span>{formatDate(data.createdAt)}</span>
          </div>
        )}
        {data.content && (
          <>
            {data.content.subject && (
              <div className="response-row">
                <span className="response-label">Subject</span>
                <span>{String(data.content.subject)}</span>
              </div>
            )}
            {data.content.body && (
              <div className="response-row">
                <span className="response-label">Body</span>
                <span className="body-preview">{String(data.content.body)}</span>
              </div>
            )}
          </>
        )}
        {data.providerResponse && (
          <div className="response-row">
            <span className="response-label">Delivery time</span>
            <span>{String(data.providerResponse.simulatedDeliveryTime || '-')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
