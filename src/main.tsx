import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SchedulingPage from './pages/SchedulingPage';
import AdminPanel from './components/AdminPanel';
import ClauseViewer from './components/ClauseViewer';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/agendar" element={<SchedulingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/normas" element={<ClauseViewer />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
