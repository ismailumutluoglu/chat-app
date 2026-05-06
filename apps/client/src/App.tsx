import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AppPage } from './pages/AppPage';
import { RoomPage } from './pages/RoomPage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/app/*"
                element={
                  <PrivateRoute>
                    <AppPage />
                  </PrivateRoute>
                }
              >
                <Route path="rooms/:roomId" element={<RoomPage />} />
                <Route index element={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', textAlign: 'center', color: '#888' }}>
                    <div>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>👈</div>
                      <div>Bir sohbet seç</div>
                    </div>
                  </div>
                } />
              </Route>
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}