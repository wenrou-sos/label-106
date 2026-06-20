import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { TodayOverview as TodayOverviewType } from '../../store/appointmentStore';
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';
import { Event, CheckCircle, Cancel, AttachMoney, TrendingUp } from '@mui/icons-material';

interface TodayOverviewProps {
  data: TodayOverviewType;
}

export default function TodayOverview({ data }: TodayOverviewProps) {
  const animatedTotal = useAnimatedNumber(data.totalAppointments);
  const animatedCompleted = useAnimatedNumber(data.completedCount);
  const animatedCancelled = useAnimatedNumber(data.cancelledCount);
  const animatedAvgPrice = useAnimatedNumber(data.avgPrice);

  const stats = [
    {
      label: '今日预约总数',
      value: animatedTotal,
      suffix: '单',
      icon: Event,
      gradient: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
      bg: 'rgba(212, 165, 116, 0.1)',
    },
    {
      label: '已完成',
      value: animatedCompleted,
      suffix: '单',
      icon: CheckCircle,
      gradient: 'linear-gradient(135deg, #A8D8D0 0%, #D0EBE6 100%)',
      bg: 'rgba(168, 216, 208, 0.15)',
    },
    {
      label: '已取消',
      value: animatedCancelled,
      suffix: '单',
      icon: Cancel,
      gradient: 'linear-gradient(135deg, #E88A7F 0%, #F5B8B0 100%)',
      bg: 'rgba(232, 138, 127, 0.12)',
    },
    {
      label: '平均客单价',
      value: animatedAvgPrice,
      prefix: '¥',
      suffix: '',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #C9A8E8 0%, #E0D0F5 100%)',
      bg: 'rgba(201, 168, 232, 0.12)',
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
          }}
        >
          今日概览
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoney sx={{ fontSize: 18, color: '#D4A574' }} />
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            今日营收 ¥{data.totalRevenue.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                background: '#fff',
                border: '1px solid rgba(212, 165, 116, 0.1)',
                boxShadow: '0 2px 8px rgba(74, 55, 40, 0.04)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(74, 55, 40, 0.08)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <stat.icon
                    sx={{
                      fontSize: 20,
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#8B7D75', fontSize: '0.75rem' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: '#4A3728',
                  lineHeight: 1.1,
                }}
              >
                {stat.prefix}
                {stat.value.toLocaleString()}
                <Typography
                  component="span"
                  sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#8B7D75', ml: 0.5 }}
                >
                  {stat.suffix}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
