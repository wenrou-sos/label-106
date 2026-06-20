import { useMemo, useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useTechnicianStore } from '../../store/technicianStore';
import { useScheduleStore, isTimeInShift } from '../../store/scheduleStore';
import { generateTimeSlots } from '../../utils/dateUtils';
import { Appointment, Technician } from '../../types';
import AppointmentCard from './AppointmentCard';
import AppointmentNotesDialog from './AppointmentNotesDialog';

const slotToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const isAppointmentInSlot = (apt: Appointment, slot: string): boolean => {
  if (apt.status === 'cancelled') return false;
  const slotMinutes = slotToMinutes(slot);
  return (
    slotMinutes >= slotToMinutes(apt.startTime) && slotMinutes < slotToMinutes(apt.endTime)
  );
};

type ViewMode = 'time' | 'technician';

export default function Timeline() {
  const { appointments, selectedDate, updateNotes } = useAppointmentStore();
  const { technicians } = useTechnicianStore();
  const { getDaySchedule } = useScheduleStore();
  const [viewMode, setViewMode] = useState<ViewMode>('time');
  const timeSlots = useMemo(() => generateTimeSlots(9, 21, 30), []);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const todayAppointments = useMemo(
    () => appointments.filter((apt) => apt.date === selectedDate),
    [appointments, selectedDate]
  );

  const handleOpenNotesDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotesDialogOpen(true);
  };

  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleSaveNotes = (id: string, notes: string) => {
    updateNotes(id, notes);
  };

  const getAppointmentsForSlot = (slotStart: string): Appointment[] => {
    return todayAppointments.filter((apt) => isAppointmentInSlot(apt, slotStart));
  };

  const getAppointmentsForTechnicianAndSlot = (
    technicianId: string,
    slotStart: string
  ): Appointment[] => {
    return todayAppointments.filter(
      (apt) => apt.technicianId === technicianId && isAppointmentInSlot(apt, slotStart)
    );
  };

  const isTechnicianAvailable = (technician: Technician, slot: string): boolean => {
    const daySchedule = getDaySchedule(technician.id, selectedDate);
    if (!daySchedule || daySchedule.isDayOff) return false;
    if (!daySchedule.shifts.some((shift) => isTimeInShift(slot, shift))) return false;
    const isBusy = todayAppointments.some(
      (apt) => apt.technicianId === technician.id && isAppointmentInSlot(apt, slot)
    );
    return !isBusy;
  };

  const getAvailableTechniciansForSlot = (slot: string): Technician[] => {
    return technicians.filter((tech) => isTechnicianAvailable(tech, slot));
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

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: ViewMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const renderTimeView = () => (
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
        const availableTechnicians = getAvailableTechniciansForSlot(slot);
        const isAvailable = availableTechnicians.length > 0;
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
              opacity: isAvailable ? 1 : 0.4,
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
              {!isAvailable && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#E88A7F',
                    fontSize: '0.75rem',
                    ml: 'auto',
                  }}
                >
                  不可预约
                </Typography>
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
                  : !isAvailable
                  ? 'rgba(232, 138, 127, 0.3)'
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
                    border: isAvailable
                      ? '1px dashed rgba(212, 165, 116, 0.2)'
                      : '1px dashed rgba(232, 138, 127, 0.2)',
                    background: isAvailable ? 'transparent' : 'rgba(232, 138, 127, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    '&:hover': isAvailable
                      ? {
                          borderColor: 'rgba(212, 165, 116, 0.4)',
                          background: 'rgba(212, 165, 116, 0.04)',
                        }
                      : {},
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: isAvailable ? '#B8AA9D' : '#E88A7F' }}
                  >
                    {isAvailable ? '空闲时段' : '无美甲师上班'}
                  </Typography>
                  {isAvailable && availableTechnicians.length > 0 && (
                    <Typography
                      variant="caption"
                      sx={{ color: '#D4A574', mt: 0.5, fontSize: '0.7rem' }}
                    >
                      {availableTechnicians.length} 位美甲师可用
                    </Typography>
                  )}
                </Box>
              ) : (
                slotAppointments.map((apt, aptIndex) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: slotIndex * 0.02 + aptIndex * 0.05 }}
                  >
                    <AppointmentCard
                      appointment={apt}
                      onNotesClick={() => handleOpenNotesDialog(apt)}
                    />
                  </motion.div>
                ))
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  const renderTechnicianView = () => (
    <Box sx={{ overflowX: 'auto', pb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          minWidth: 'max-content',
          '&::-webkit-scrollbar': {
            height: 6,
          },
        }}
      >
        <Box
          sx={{
            flex: '0 0 140px',
            minWidth: 140,
            position: 'sticky',
            left: 0,
            zIndex: 2,
            background: '#FAF7F5',
            pr: 2,
          }}
        >
          <Box sx={{ height: 36, mb: 2 }} />
          {technicians.map((tech) => (
            <Box
              key={tech.id}
              sx={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 1.5,
                p: 1.5,
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid rgba(212, 165, 116, 0.1)',
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundImage: `url(${tech.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#4A3728',
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tech.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: getDaySchedule(tech.id, selectedDate)?.isDayOff
                      ? '#E88A7F'
                      : '#8B7D75',
                    fontSize: '0.7rem',
                  }}
                >
                  {getDaySchedule(tech.id, selectedDate)?.isDayOff
                    ? '今日休息'
                    : '在岗'}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {timeSlots.map((slot) => {
            const isCurrent = isCurrentTimeSlot(slot);
            return (
              <Box
                key={slot}
                sx={{
                  flex: '0 0 140px',
                  minWidth: 140,
                }}
              >
                <Box
                  sx={{
                    height: 36,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.875rem',
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

                {technicians.map((tech) => {
                  const apts = getAppointmentsForTechnicianAndSlot(tech.id, slot);
                  const isAvailable = isTechnicianAvailable(tech, slot);

                  return (
                    <Box
                      key={`${tech.id}-${slot}`}
                      sx={{
                        height: 80,
                        mb: 1.5,
                        borderRadius: '12px',
                        background: apts.length > 0
                          ? 'transparent'
                          : isAvailable
                            ? 'rgba(212, 165, 116, 0.03)'
                            : 'rgba(232, 138, 127, 0.04)',
                        border: apts.length > 0
                          ? '1px solid transparent'
                          : isAvailable
                            ? '1px dashed rgba(212, 165, 116, 0.15)'
                            : '1px dashed rgba(232, 138, 127, 0.15)',
                        opacity: apts.length > 0 ? 1 : isAvailable ? 1 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: apts.length > 0 ? 'flex-start' : 'center',
                        p: apts.length > 0 ? 0 : 1,
                        transition: 'all 0.2s ease',
                        cursor: apts.length > 0
                          ? 'pointer'
                          : isAvailable
                            ? 'pointer'
                            : 'not-allowed',
                        '&:hover': apts.length > 0
                          ? {}
                          : isAvailable
                            ? {
                                background: 'rgba(212, 165, 116, 0.08)',
                              }
                            : {},
                      }}
                    >
                      {apts.length > 0 ? (
                        apts.map((apt) => (
                          <motion.div
                            key={apt.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ width: '100%' }}
                          >
                            <AppointmentCard
                              appointment={apt}
                              compact
                              onNotesClick={() => handleOpenNotesDialog(apt)}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <Typography
                          variant="caption"
                          sx={{
                            color: isAvailable ? '#B8AA9D' : '#E88A7F',
                            fontSize: '0.7rem',
                            textAlign: 'center',
                          }}
                        >
                          {isAvailable ? '空闲' : '休息'}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );

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
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#4A3728',
          }}
        >
          今日时间轴
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          size="small"
          sx={{
            background: '#fff',
            borderRadius: '10px',
            border: '1px solid rgba(212, 165, 116, 0.15)',
            '& .MuiToggleButton-root': {
              border: 'none',
              px: 2,
              py: 0.75,
              color: '#8B7D75',
              fontSize: '0.8125rem',
              fontWeight: 500,
              borderRadius: '8px',
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(212,165,116,0.15) 0%, rgba(248,232,236,0.5) 100%)',
                color: '#D4A574',
                fontWeight: 600,
              },
              '&:hover': {
                background: 'rgba(212, 165, 116, 0.05)',
              },
            },
          }}
        >
          <ToggleButton value="time">按时间</ToggleButton>
          <ToggleButton value="technician">按美甲师</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'time' ? renderTimeView() : renderTechnicianView()}

      <AppointmentNotesDialog
        open={notesDialogOpen}
        appointment={selectedAppointment}
        onClose={handleCloseNotesDialog}
        onSave={handleSaveNotes}
      />
    </Box>
  );
}
