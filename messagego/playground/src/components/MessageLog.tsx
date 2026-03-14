interface Message {
  id: string;
  channel: string;
  to: string;
  status: string;
}

interface Props {
  messages: Message[];
  onSelect: (id: string) => void;
  onRefresh: () => void;
}

const channelLabels: Record<string, string> = {
  sms: 'SMS',
  email: 'Email',
  whatsapp: 'WhatsApp',
};

export default function MessageLog({ messages, onSelect, onRefresh }: Props) {
  return (
    <div className="message-log">
      <div className="log-header">
        <h2>Message History</h2>
        <button onClick={onRefresh} type="button">Refresh</button>
      </div>
      {messages.length === 0 ? (
        <p className="empty">No messages sent yet. Use the form above to send your first message.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Message ID</th>
              <th>Channel</th>
              <th>Recipient</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id} onClick={() => onSelect(msg.id)} className="clickable">
                <td className="mono">{msg.id}</td>
                <td>{channelLabels[msg.channel] || msg.channel}</td>
                <td>{msg.to}</td>
                <td><span className={`badge badge-${msg.status}`}>{msg.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {messages.length > 0 && (
        <p className="table-hint">Click a row to view full details</p>
      )}
    </div>
  );
}
