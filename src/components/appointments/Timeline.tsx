import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppointmentStore } from '../../store/appointmentStore';
import { generateTimeSlots } from '../../utils/dateUtils';
import { Appointment } from '../../types';
import AppointmentCard from './AppointmentCard';

export default function Timeline() {
  const { appointments, selectedDate } = useAppointmentStore();
  const timeSlots = useMemo(() => generateTimeSlots(9, 21, 30), []);

  const todayAppointments = useMemo(
    () => appointments.filter((apt) => apt.date === selectedDate),
    [appointments, selectedDate]
  );

  const getAppointmentsForSlot = (slotStart: string): Appointment[] => {
    return todayAppointments.filter((apt) => apt.startTime === slotStart);
  };

  const isCurrentTimeSlot = (slot: string): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [slotHour, slotMinute] = slot.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;
    const currentMinutes = currentHour * 60 + currentMinute;
    return currentMinutes >= slotStartMinutes && currentMinutes < slotStartMinutes + 30;
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(212, 165, 116, 0.08)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(212, 165, 116, 0.25)',
            borderRadius: 3,
            '&:hover': {
              background: 'rgba(212, 165, 116, 0.4)',
            },
          },
        }}
      >
        {timeSlots.map((slot, slotIndex) => {
          const slotAppointments = getAppointmentsForSlot(slot);
          const isCurrent = isCurrentTimeSlot(slot);

          return (
            <Box
              key={slot}
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: slotIndex * 0.02 }}
              sx={{
                flex: '0 0 220px',
                minWidth: 220,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: isCurrent ? '#D4A574' : '#4A3728',
                    fontFamily: isCurrent ? '"Playfair Display", serif' : 'inherit',
                  }}
                >
                  {slot}
                </Typography>
                {isCurrent && (
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
                      boxShadow: '0 0 0 4px rgba(212, 165, 116, 0.15)',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                )}
              </Box>

              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 32,
                  bottom: 0,
                  width: 2,
                  borderRadius: 2,
                  background: isCurrent
                    ? 'linear-gradient(180deg, #D4A574 0%, rgba(212, 165, 116, 0.1) 100%)'
                    : 'rgba(212, 165, 116, 0.1)',
                }}
              />

              <Box
                sx={{
                  pl: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  minHeight: 60,
                }}
              >
                {slotAppointments.length === 0 ? (
                  <Box
                    sx={{
                      height: 56,
                      borderRadius: '12px',
                      border: '1px dashed rgba(212, 165, 116, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'rgba(212, 165, 116, 0.4)',
                        background: 'rgba(212, 165, 116, 0.04)',
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: '#B8AA9D' }}
                    >
                      空闲时段
                    </Typography>
                  </Box>
                ) : (
                  slotAppointments.map((apt, aptIndex) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: slotIndex * 0.02 + aptIndex * 0.05 }}
                    >
                      <AppointmentCard appointment={apt} />
                    </motion.div>
                  ))
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
