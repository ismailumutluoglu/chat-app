import { useAuth } from '../contexts/AuthContext';

export function AppPage() {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>ChatApp</h1>
        <button onClick={logout}>Çıkış Yap</button>
      </div>
      <p>Issue #6'da sidebar ve oda listesi buraya gelecek.</p>
    </div>
  );
}