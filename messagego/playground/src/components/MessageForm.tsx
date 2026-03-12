import { useState } from 'react';
import { sendMessage } from '../api/client';

type Channel = 'sms' | 'email' | 'whatsapp';

const placeholders: Record<Channel, string> = {
  sms: '+12025551234',
  email: 'user@example.com',
  whatsapp: '+201234567890',
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
      <h2>Send Message</h2>

      <label>
        Channel
        <select value={channel} onChange={e => setChannel(e.target.value as Channel)}>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>
      </label>

      <label>
        To
        <input
          type="text"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder={placeholders[channel]}
          required
        />
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
        Body
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Your message here..."
          rows={4}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
