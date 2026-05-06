import { useState } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { useAuth } from '../../contexts/AuthContext';
import { RoomListItem } from '../rooms/RoomListItem';
import { NewChatModal } from '../rooms/NewChatModal';

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useRooms();
  const { logout } = useAuth();

  const rooms = data?.data || [];
  const filtered = rooms.filter((r: any) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ?? true,
  );

  return (
    <>
      <aside style={{
        width: 300, borderRight: '1px solid #e5e7eb',
        display: 'flex', flexDirection: 'column', height: '100vh',
        background: '#fafafa',
      }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>💬 ChatApp</h2>
            <button
              onClick={logout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}
            >
              Çıkış
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sohbet ara..."
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, boxSizing: 'border-box' }}
          />
        </div>

        {/* Oda listesi */}
        <div style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
          {isLoading ? (
            <div style={{ padding: 16, color: '#888', fontSize: 13 }}>Yükleniyor...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 16, color: '#888', fontSize: 13 }}>Henüz sohbet yok</div>
          ) : (
            filtered.map((room: any) => <RoomListItem key={room.id} room={room} />)
          )}
        </div>

        {/* Yeni sohbet butonu */}
        <div style={{ padding: 16, borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              width: '100%', padding: '10px', borderRadius: 8,
              background: '#6366f1', color: '#fff', border: 'none',
              cursor: 'pointer', fontWeight: 500, fontSize: 14,
            }}
          >
            + Yeni Sohbet
          </button>
        </div>
      </aside>

      {isModalOpen && <NewChatModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}