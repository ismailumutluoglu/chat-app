import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { useSocket } from '../contexts/SocketContext';

interface Message {
  _id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
}

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();
  const optimisticIds = useRef(new Set<string>());

  const loadMessages = useCallback(async (cursor?: string) => {
    if (!roomId) return;
    setIsLoading(true);
    try {
      const params = cursor ? `?cursor=${cursor}` : '';
      const { data } = await api.get(`/rooms/${roomId}/messages${params}`);
      setMessages((prev) => (cursor ? [...data.data, ...prev] : data.data));
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // Initial load when room changes
  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    setNextCursor(null);
    optimisticIds.current.clear();
    loadMessages();
  }, [roomId]);

  // Join/leave room via socket
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('joinRoom', { roomId });
    return () => {
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId, socket]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    const handler = (message: Message) => {
      setMessages((prev) => {
        const withoutOptimistic = prev.filter(
          (m) => !optimisticIds.current.has(m._id),
        );
        optimisticIds.current.clear();
        return [...withoutOptimistic, message];
      });
    };
    socket.on('newMessage', handler);
    return () => {
      socket.off('newMessage', handler);
    };
  }, [socket]);

  const sendMessage = useCallback((content: string, currentUserId: string) => {
    const tempId = `temp-${Date.now()}`;
    optimisticIds.current.add(tempId);
    const optimistic: Message = {
      _id: tempId,
      room_id: roomId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
      is_deleted: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    socket?.emit('sendMessage', { roomId, content });
  }, [roomId, socket]);

  return { messages, isLoading, nextCursor, loadMessages, sendMessage };
}
