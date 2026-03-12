interface Props {
  response: unknown;
}

export default function ResponseViewer({ response }: Props) {
  return (
    <div className="response-viewer">
      <h2>Response</h2>
      <pre>{response ? JSON.stringify(response, null, 2) : 'Send a message to see the response here.'}</pre>
    </div>
  );
}
