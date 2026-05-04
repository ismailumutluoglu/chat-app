import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

window.__accessToken = null;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);