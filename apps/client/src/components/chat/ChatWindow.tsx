import { useParams } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useAuth } from '../../contexts/AuthContext';

export function ChatWindow() {
  const { roomId } = useParams<{ roomId: string }>();
  const { currentUserId } = useAuth();
  const { messages, isLoading, nextCursor, loadMessages, sendMessage } = useMessages(roomId!);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      width: '100%',
      overflow: 'hidden'
    }}>
      <MessageList
        messages={messages}
        currentUserId={currentUserId ?? ''}
        onLoadMore={() => loadMessages(nextCursor ?? undefined)}
        hasMore={!!nextCursor}
        isLoading={isLoading}
      />
      <MessageInput
        onSend={(content) => sendMessage(content, currentUserId ?? '')}
        disabled={false}
      />
    </div>
  );
}