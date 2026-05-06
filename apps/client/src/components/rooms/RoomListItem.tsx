import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/tr';

dayjs.extend(relativeTime);
dayjs.locale('tr');

interface Props {
  room: {
    id: string;
    name: string | null;
    type: string;
    updatedAt: string;
  };
}

export function RoomListItem({ room }: Props) {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const isActive = roomId === room.id;

  const displayName = room.name || (room.type === 'direct' ? 'Birebir Sohbet' : 'Grup');

  return (
    <div
      onClick={() => navigate(`/app/rooms/${room.id}`)}
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: 8,
        margin: '2px 8px',
        background: isActive ? '#ede9fe' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f5f5f5'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: isActive ? '#6366f1' : '#e5e7eb',
        color: isActive ? '#fff' : '#374151',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 600, fontSize: 15, flexShrink: 0,
      }}>
        {room.type === 'group' ? '👥' : displayName[0]?.toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {displayName}
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>
          {dayjs(room.updatedAt).fromNow()}
        </div>
      </div>
    </div>
  );
}