import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Sadece login olunca bağlan
    if (!isAuthenticated || !window.__accessToken) return;

    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token: window.__accessToken },
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('Socket bağlandı:', s.id);
    });

    s.on('connect_error', (err) => {
      console.log('Socket hata:', err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);