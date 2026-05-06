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

interface OptimisticEntry {
  content: string;
  senderId: string;
}

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const socket = useSocket();
  // tempId → { content, senderId } — her optimistic mesaj için ayrı entry
  const optimisticMap = useRef(new Map<string, OptimisticEntry>());

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

  // Oda değişince sıfırla
  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    setNextCursor(null);
    optimisticMap.current.clear();
    loadMessages();
  }, [roomId]);

  // Odaya katıl / ayrıl
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('joinRoom', { roomId });
    return () => {
      socket.emit('leaveRoom', { roomId });
    };
  }, [roomId, socket]);

  // Gelen mesajları dinle
  useEffect(() => {
    if (!socket) return;
    const handler = (message: Message) => {
      setMessages((prev) => {
        // Aynı gerçek mesaj zaten varsa ekleme (dedup)
        if (prev.some((m) => m._id === message._id)) return prev;

        // Bu mesajın optimistic karşılığını bul (aynı content + senderId)
        let matchedTempId: string | null = null;
        for (const [tempId, entry] of optimisticMap.current) {
          if (entry.content === message.content && entry.senderId === message.sender_id) {
            matchedTempId = tempId;
            break;
          }
        }

        if (matchedTempId) {
          // Sadece eşleşen optimistic'i kaldır, diğerlerine dokunma
          optimisticMap.current.delete(matchedTempId);
          return [...prev.filter((m) => m._id !== matchedTempId), message];
        }

        // Başkasından gelen mesaj — direkt ekle
        return [...prev, message];
      });
    };
    socket.on('newMessage', handler);
    return () => {
      socket.off('newMessage', handler);
    };
  }, [socket]);

  const sendMessage = useCallback((content: string, currentUserId: string) => {
    const tempId = `temp-${Date.now()}`;
    optimisticMap.current.set(tempId, { content, senderId: currentUserId });

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
