import dayjs from 'dayjs';

interface Message {
  _id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
}

interface Props {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: Props) {
  const isOptimistic = message._id.startsWith('temp-');

  return (
    <div style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
      <div
        style={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isOwn ? '#6366f1' : '#f3f4f6',
          color: isOwn ? '#fff' : '#111',
          opacity: isOptimistic ? 0.65 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {message.is_deleted ? (
          <span style={{ fontStyle: 'italic', opacity: 0.6, fontSize: 13 }}>Bu mesaj silindi</span>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 14 }}>
            {message.content}
          </span>
        )}
        <div style={{ fontSize: 11, marginTop: 4, opacity: 0.65, textAlign: 'right' }}>
          {dayjs(message.created_at).format('HH:mm')}
        </div>
      </div>
    </div>
  );
}
