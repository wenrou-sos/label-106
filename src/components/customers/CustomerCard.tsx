import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Customer } from '../../types';
import { CalendarToday, AttachMoney } from '@mui/icons-material';
import { maskPhone } from '../../utils/dateUtils';

interface CustomerCardProps {
  customer: Customer;
  index: number;
  onClick?: () => void;
}

export default function CustomerCard({ customer, index, onClick }: CustomerCardProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -3, scale: 1.01 }}
      onClick={onClick}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        background: '#fff',
        border: '1px solid rgba(212, 165, 116, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 28px rgba(74, 55, 40, 0.1)',
          borderColor: 'rgba(212, 165, 116, 0.25)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            backgroundImage: `url(${customer.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            flexShrink: 0,
            border: '2px solid #F8E8EC',
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: '#4A3728',
              mb: 0.25,
            }}
          >
            {customer.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            {maskPhone(customer.phone)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            p: 1.25,
            borderRadius: '10px',
            background: 'rgba(168, 216, 208, 0.12)',
          }}
        >
          <CalendarToday sx={{ fontSize: 16, color: '#3E8E82' }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#6B5D55', display: 'block' }}>
              到店次数
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#3E8E82' }}>
              {customer.totalVisits} 次
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            p: 1.25,
            borderRadius: '10px',
            background: 'rgba(212, 165, 116, 0.12)',
          }}
        >
          <AttachMoney sx={{ fontSize: 16, color: '#9A6F42' }} />
          <Box>
            <Typography variant="caption" sx={{ color: '#6B5D55', display: 'block' }}>
              累计消费
            </Typography>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#9A6F42' }}>
              ¥{customer.totalSpent.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {customer.notes && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: '10px',
            background: 'rgba(248, 232, 236, 0.5)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#8B7D75', fontSize: '0.75rem', lineHeight: 1.5 }}
          >
            📝 {customer.notes}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
