import { ReactNode, useEffect } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppointmentStore } from '../../store/appointmentStore';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const checkLateAppointments = useAppointmentStore((s) => s.checkLateAppointments);

  useEffect(() => {
    checkLateAppointments();
    const interval = setInterval(checkLateAppointments, 60000);
    return () => clearInterval(interval);
  }, [checkLateAppointments]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#FAF7F5' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <Box sx={{ flex: 1, p: 4, overflow: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  );
}
