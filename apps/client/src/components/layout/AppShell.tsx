import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', background: '#fff' }}>
        <Outlet />
      </main>
    </div>
  );
}