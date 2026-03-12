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

export default function MessageLog({ messages, onSelect, onRefresh }: Props) {
  return (
    <div className="message-log">
      <div className="log-header">
        <h2>Message History</h2>
        <button onClick={onRefresh} type="button">Refresh</button>
      </div>
      {messages.length === 0 ? (
        <p className="empty">No messages yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Channel</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map(msg => (
              <tr key={msg.id} onClick={() => onSelect(msg.id)} className="clickable">
                <td>{msg.id}</td>
                <td>{msg.channel}</td>
                <td>{msg.to}</td>
                <td className={`status-${msg.status}`}>{msg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
