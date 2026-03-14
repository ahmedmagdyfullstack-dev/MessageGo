import { useState, useEffect, useCallback } from 'react';
import MessageForm from './components/MessageForm';
import ResponseViewer from './components/ResponseViewer';
import MessageLog from './components/MessageLog';
import { getMessage, listMessages } from './api/client';

interface Message {
  id: string;
  channel: string;
  to: string;
  status: string;
}

export default function App() {
  const [response, setResponse] = useState<unknown>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadMessages = useCallback(async () => {
    try {
      const data = await listMessages();
      setMessages(data.messages || []);
    } catch {
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  async function handleSend(res: unknown) {
    setResponse(res);
    await loadMessages();
  }

  async function handleSelect(id: string) {
    try {
      const detail = await getMessage(id);
      setResponse(detail);
    } catch (err) {
      setResponse({ error: { code: 'NETWORK_ERROR', message: String(err) } });
    }
  }

  return (
    <div className="app">
      <h1>MessageGO Playground</h1>
      <p className="subtitle">Send test messages via Email, SMS, or WhatsApp and see the results.</p>
      <div className="top-section">
        <MessageForm onSend={handleSend} />
        <ResponseViewer response={response} />
      </div>
      <MessageLog messages={messages} onSelect={handleSelect} onRefresh={loadMessages} />
    </div>
  );
}
