import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Technician, TECHNICIAN_STATUS_LABELS } from '../../types';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

interface TechnicianCardProps {
  technician: Technician;
  index: number;
}

const statusConfig: Record<
  string,
  { bg: string; text: string; ring: string; dot: string }
> = {
  idle: {
    bg: 'rgba(168, 216, 208, 0.15)',
    text: '#3E8E82',
    ring: 'rgba(168, 216, 208, 0.5)',
    dot: '#A8D8D0',
  },
  serving: {
    bg: 'rgba(212, 165, 116, 0.15)',
    text: '#9A6F42',
    ring: 'rgba(212, 165, 116, 0.5)',
    dot: '#D4A574',
  },
  break: {
    bg: 'rgba(232, 168, 127, 0.15)',
    text: '#D48B5C',
    ring: 'rgba(232, 168, 127, 0.5)',
    dot: '#E8A87F',
  },
  off: {
    bg: 'rgba(139, 125, 117, 0.12)',
    text: '#6B5D55',
    ring: 'rgba(139, 125, 117, 0.3)',
    dot: '#8B7D75',
  },
};

export default function TechnicianCard({ technician, index }: TechnicianCardProps) {
  const config = statusConfig[technician.status];
  const animatedRevenue = useAnimatedNumber(technician.todayRevenue);
  const animatedCount = useAnimatedNumber(technician.todayCompletedCount);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.01 }}
      sx={{
        p: 3,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F5 100%)',
        border: '1px solid rgba(212, 165, 116, 0.1)',
        boxShadow: '0 4px 12px rgba(74, 55, 40, 0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 32px rgba(74, 55, 40, 0.1)',
          borderColor: 'rgba(212, 165, 116, 0.2)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5 }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundImage: `url(${technician.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: `3px solid ${config.ring}`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: config.dot,
              border: '2px solid #fff',
              boxShadow: technician.status === 'serving' ? `0 0 0 4px ${config.ring}` : 'none',
              animation: technician.status === 'serving' ? 'pulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1rem',
              color: '#4A3728',
              mb: 0.5,
            }}
          >
            {technician.name}
          </Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              px: 1.5,
              py: 0.25,
              borderRadius: '8px',
              background: config.bg,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: config.dot,
                mr: 1,
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: config.text, fontWeight: 600, fontSize: '0.75rem' }}
            >
              {TECHNICIAN_STATUS_LABELS[technician.status]}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(248,232,236,0.6) 0%, rgba(252,244,246,0.8) 100%)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#8B7D75', display: 'block', mb: 0.5 }}
          >
            今日完成
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#4A3728',
              lineHeight: 1.1,
            }}
          >
            {animatedCount}
            <Typography
              component="span"
              sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#8B7D75', ml: 0.5 }}
            >
              单
            </Typography>
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(212,165,116,0.1) 0%, rgba(232,201,160,0.2) 100%)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#8B7D75', display: 'block', mb: 0.5 }}
          >
            累计营收
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#9A6F42',
              lineHeight: 1.1,
            }}
          >
            ¥
            <Typography
              component="span"
              sx={{ fontSize: '1.5rem', fontWeight: 600 }}
            >
              {animatedRevenue.toLocaleString()}
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
