import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './theme/ThemeContext';
import './i18n';
import './index.css';
import './corporate-theme.css';

// Keep the public CV lean: the legacy portal, admin screens and scheduling tools
// are loaded only when a visitor navigates to those routes.
const App = lazy(() => import('./App'));
const SchedulingPage = lazy(() => import('./pages/SchedulingPage'));
const PublicCurriculumPage = lazy(() => import('./pages/PublicCurriculumPage'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const ClauseViewer = lazy(() => import('./components/ClauseViewer'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 text-sm text-slate-600">
      Loading Coach ISO…
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<App />} />
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
