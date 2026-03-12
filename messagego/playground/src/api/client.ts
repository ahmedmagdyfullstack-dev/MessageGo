const API_BASE = 'http://localhost:3001/api/v1';

export async function sendMessage(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getMessage(id: string) {
  const res = await fetch(`${API_BASE}/messages/${id}`);
  return res.json();
}

export async function listMessages(limit = 20) {
  const res = await fetch(`${API_BASE}/messages?limit=${limit}`);
  return res.json();
}
