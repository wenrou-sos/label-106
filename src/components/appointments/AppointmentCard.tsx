import { Box, Typography, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Appointment, APPOINTMENT_STATUS_LABELS, SERVICE_TYPE_LABELS } from '../../types';
import { AccessTime, Person, ContentCut } from '@mui/icons-material';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
  compact?: boolean;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'rgba(139, 125, 117, 0.1)', text: '#6B5D55', border: 'rgba(139, 125, 117, 0.2)' },
  confirmed: { bg: 'rgba(212, 165, 116, 0.12)', text: '#B88B5A', border: 'rgba(212, 165, 116, 0.25)' },
  arrived: { bg: 'rgba(168, 216, 208, 0.2)', text: '#3E8E82', border: 'rgba(168, 216, 208, 0.4)' },
  serving: { bg: 'rgba(212, 165, 116, 0.18)', text: '#9A6F42', border: 'rgba(212, 165, 116, 0.35)' },
  completed: { bg: 'rgba(168, 216, 208, 0.15)', text: '#5E9E94', border: 'rgba(168, 216, 208, 0.3)' },
  cancelled: { bg: 'rgba(139, 125, 117, 0.08)', text: '#8B7D75', border: 'rgba(139, 125, 117, 0.15)' },
  late: { bg: 'rgba(232, 138, 127, 0.15)', text: '#D06B5E', border: 'rgba(232, 138, 127, 0.35)' },
};

export default function AppointmentCard({ appointment, onClick, compact }: AppointmentCardProps) {
  const colors = statusColors[appointment.status] || statusColors.pending;
  const isLate = appointment.isLate;

  if (compact) {
    return (
      <Box
        component={motion.div}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
        onClick={onClick}
        sx={{
          position: 'relative',
          p: 1.5,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          background: isLate
            ? `linear-gradient(135deg, rgba(232,138,127,0.08) 0%, rgba(245,196,190,0.15) 100%)`
            : `linear-gradient(135deg, ${colors.bg} 0%, rgba(255,255,255,0.9) 100%)`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              color: '#4A3728',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              mr: 0.5,
            }}
          >
            {appointment.customerName}
          </Typography>
          <Chip
            label={
              isLate
                ? `迟到${appointment.lateMinutes || ''}分`
                : APPOINTMENT_STATUS_LABELS[appointment.status]
            }
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 600,
              background: isLate
                ? 'linear-gradient(135deg, #E88A7F 0%, #F5C4BE 100%)'
                : colors.bg,
              color: isLate ? '#fff' : colors.text,
              border: 'none',
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ContentCut sx={{ fontSize: 12, color: '#8B7D75' }} />
          <Typography variant="caption" sx={{ color: '#6B5D55', fontSize: '0.6875rem' }}>
            {SERVICE_TYPE_LABELS[appointment.serviceType]}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTime sx={{ fontSize: 12, color: isLate ? '#E88A7F' : '#8B7D75' }} />
          <Typography
            variant="caption"
            sx={{
              color: isLate ? '#D06B5E' : '#6B5D55',
              fontSize: '0.6875rem',
              fontWeight: isLate ? 600 : 400,
            }}
          >
              {appointment.startTime} - {appointment.endTime}
            </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 2,
        borderRadius: '14px',
        border: `1px solid ${colors.border}`,
        background: isLate
          ? `linear-gradient(135deg, rgba(232,138,127,0.08) 0%, rgba(245,196,190,0.15) 100%)`
          : `linear-gradient(135deg, ${colors.bg} 0%, rgba(255,255,255,0.9) 100%)`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&::before': isLate
          ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '14px',
              border: '2px solid rgba(232, 138, 127, 0.5)',
              animation: 'pulse-border 2s ease-in-out infinite',
            }
          : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            color: '#4A3728',
          }}
        >
          {appointment.customerName}
        </Typography>
        <Chip
          label={
            isLate
              ? `迟到${appointment.lateMinutes || ''}分钟`
              : APPOINTMENT_STATUS_LABELS[appointment.status]
          }
          size="small"
          sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 600,
            background: isLate
              ? 'linear-gradient(135deg, #E88A7F 0%, #F5C4BE 100%)'
              : colors.bg,
            color: isLate ? '#fff' : colors.text,
            border: 'none',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ContentCut sx={{ fontSize: 16, color: '#8B7D75' }} />
        <Typography variant="body2" sx={{ color: '#6B5D55', fontSize: '0.8125rem' }}>
          {SERVICE_TYPE_LABELS[appointment.serviceType]}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Person sx={{ fontSize: 16, color: '#8B7D75' }} />
        <Typography variant="body2" sx={{ color: '#6B5D55', fontSize: '0.8125rem' }}>
          {appointment.technicianName}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccessTime sx={{ fontSize: 16, color: isLate ? '#E88A7F' : '#8B7D75' }} />
        <Typography
          variant="body2"
          sx={{
            color: isLate ? '#D06B5E' : '#6B5D55',
            fontSize: '0.8125rem',
            fontWeight: isLate ? 600 : 400,
          }}
        >
          {appointment.startTime} - {appointment.endTime}
        </Typography>
      </Box>
    </Box>
  );
}
