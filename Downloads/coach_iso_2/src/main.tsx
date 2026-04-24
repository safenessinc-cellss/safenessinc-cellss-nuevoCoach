import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import SchedulingPage from './pages/SchedulingPage.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import ClauseViewer from './components/ClauseViewer.tsx';
import ChatWidget from './components/ChatWidget.tsx';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/agendar" element={<SchedulingPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/normas" element={<ClauseViewer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
