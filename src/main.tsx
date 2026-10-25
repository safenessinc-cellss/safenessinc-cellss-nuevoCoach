import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import SchedulingPage from './pages/SchedulingPage';
import PublicCurriculumPage from './pages/PublicCurriculumPage';
import AdminPanel from './components/AdminPanel';
import ClauseViewer from './components/ClauseViewer';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import './i18n';
import './index.css';
import './corporate-theme.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicCurriculumPage />} />
            <Route path="/portal" element={<App />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/agendar" element={<SchedulingPage />} />
            <Route path="/curriculo" element={<PublicCurriculumPage />} />
            <Route path="/resume" element={<PublicCurriculumPage />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/normas" element={
              <ProtectedRoute allowedRoles={['superadmin', 'admin', 'supervisor']}>
                <ClauseViewer />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
