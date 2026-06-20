import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TechniciansPage from './pages/TechniciansPage';
import ColorPalettePage from './pages/ColorPalettePage';
import CustomersPage from './pages/CustomersPage';
import SchedulePage from './pages/SchedulePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/technicians"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TechniciansPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/color-palette"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ColorPalettePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/customers"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CustomersPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/schedule"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SchedulePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
