import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserSearch } from '../../hooks/useUserSearch';
import { useCreateRoom } from '../../hooks/useRooms';

interface Props {
  onClose: () => void;
}

export function NewChatModal({ onClose }: Props) {
  const { query, setQuery, results, isLoading } = useUserSearch();
  const createRoom = useCreateRoom();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectUser = async (userId: string) => {
    setIsCreating(true);
    try {
      const room = await createRoom.mutateAsync({
        type: 'direct',
        memberIds: [userId],
      });
      navigate(`/app/rooms/${room.id}`);
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 24,
        width: 400, maxHeight: 500,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Yeni Sohbet</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kullanıcı ara..."
          style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', marginBottom: 12, boxSizing: 'border-box' }}
          autoFocus
        />

        {isLoading && <div style={{ color: '#888', fontSize: 13 }}>Aranıyor...</div>}

        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {results.map((user) => (
            <div
              key={user.id}
              onClick={() => !isCreating && handleSelectUser(user.id)}
              style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: '#6366f1', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 600, fontSize: 14,
              }}>
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{user.username}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
              </div>
            </div>
          ))}

          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div style={{ color: '#888', fontSize: 13, padding: '8px 12px' }}>Kullanıcı bulunamadı</div>
          )}
        </div>
      </div>
    </div>
  );
}