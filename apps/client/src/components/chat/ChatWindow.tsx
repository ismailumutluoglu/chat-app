import { useParams } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

function decodeJWT(token: string): { sub?: string } | null {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function ChatWindow() {
  const { roomId } = useParams<{ roomId: string }>();
  const payload = window.__accessToken ? decodeJWT(window.__accessToken) : null;
  const currentUserId = payload?.sub ?? '';

  const { messages, isLoading, nextCursor, loadMessages, sendMessage } = useMessages(roomId!);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        onLoadMore={() => loadMessages(nextCursor ?? undefined)}
        hasMore={!!nextCursor}
        isLoading={isLoading}
      />
      <MessageInput
        onSend={(content) => sendMessage(content, currentUserId)}
        disabled={false}
      />
    </div>
  );
}
