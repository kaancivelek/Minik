import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import { ConfigProvider } from 'antd';
import trTR from 'antd/locale/tr_TR';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Maintenance from './pages/Maintenance';
import Discounts from './pages/Discounts';
import Logs from './pages/Logs';
import SupportTickets from './pages/SupportTickets';
import SystemSettings from './pages/SystemSettings';

// Lazy loading ile sayfaları yükleyelim
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Users = React.lazy(() => import('./pages/Users'));
const Houses = React.lazy(() => import('./pages/Houses'));
const Reservations = React.lazy(() => import('./pages/Reservations'));
const Settings = React.lazy(() => import('./pages/Settings'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={trTR}>
        {/* ✅ Removed MemoryRouter - let main app handle routing */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/dashboard" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <Dashboard />
              </React.Suspense>
            } />
            <Route path="/users" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <Users />
              </React.Suspense>
            } />
            <Route path="/houses" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <Houses />
              </React.Suspense>
            } />
            <Route path="/reservations" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <Reservations />
              </React.Suspense>
            } />
            <Route path="/settings" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <Settings />
              </React.Suspense>
            } />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/discounts" element={<Discounts />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/support-tickets" element={<SupportTickets />} />
            <Route path="/system-settings" element={<SystemSettings />} />
          </Route>
        </Routes>
      </ConfigProvider>
    </Provider>
  );
}

export default App;