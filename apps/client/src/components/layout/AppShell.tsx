import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        overflow: 'hidden', 
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        position: 'relative',
        height: '100vh'
      }}>
        <Outlet />
      </main>
    </div>
  );
}