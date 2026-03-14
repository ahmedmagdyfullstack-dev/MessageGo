import { useState } from 'react';
import { sendMessage } from '../api/client';

type Channel = 'sms' | 'email' | 'whatsapp';

const channelLabels: Record<Channel, string> = {
  sms: 'SMS',
  email: 'Email',
  whatsapp: 'WhatsApp',
};

const placeholders: Record<Channel, string> = {
  sms: '+12025551234',
  email: 'user@example.com',
  whatsapp: '+201234567890',
};

const toHints: Record<Channel, string> = {
  sms: 'Phone number in international format (e.g. +1...)',
  email: 'Email address',
  whatsapp: 'Phone number in international format (e.g. +20...)',
};

interface Props {
  onSend: (response: unknown) => void;
}

export default function MessageForm({ onSend }: Props) {
  const [channel, setChannel] = useState<Channel>('sms');
  const [to, setTo] = useState('');
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload: Record<string, unknown> = {
      channel,
      to,
      content: channel === 'email' ? { subject, body } : { body },
    };

    try {
      const response = await sendMessage(payload);
      onSend(response);
    } catch (err) {
      onSend({ error: { code: 'NETWORK_ERROR', message: String(err) } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <h2>Send a Message</h2>

      <div className="channel-selector">
        {(Object.keys(channelLabels) as Channel[]).map(ch => (
          <button
            key={ch}
            type="button"
            className={`channel-btn ${channel === ch ? 'active' : ''}`}
            onClick={() => setChannel(ch)}
          >
            {channelLabels[ch]}
          </button>
        ))}
      </div>

      <label>
        Recipient
        <input
          type="text"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder={placeholders[channel]}
          required
        />
        <span className="field-hint">{toHints[channel]}</span>
      </label>

      {channel === 'email' && (
        <label>
          Subject
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Order Update"
            required
          />
        </label>
      )}

      <label>
        Message
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Your message here..."
          rows={4}
          required
        />
      </label>

      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? 'Sending...' : `Send ${channelLabels[channel]}`}
      </button>
    </form>
  );
}
