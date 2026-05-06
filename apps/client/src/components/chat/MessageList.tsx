import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';

interface Message {
  _id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
}

interface Props {
  messages: Message[];
  currentUserId: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function MessageList({ messages, currentUserId, onLoadMore, hasMore, isLoading }: Props) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // IntersectionObserver: load older messages when top sentinel is visible
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 0.1 },
    );
    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div ref={topRef} style={{ height: 1 }} />
      <div style={{ flex: 1 }} />
      {isLoading && messages.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, padding: 16 }}>
          Yükleniyor...
        </div>
      )}
      {isLoading && messages.length > 0 && (
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 12, padding: 8 }}>
          Eski mesajlar yükleniyor...
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={msg.sender_id === currentUserId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
