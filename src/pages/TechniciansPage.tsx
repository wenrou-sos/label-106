import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import TechnicianCard from '../components/technicians/TechnicianCard';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { useLiveTechnicians } from '../hooks/useLiveTechnicians';
import { People, TrendingUp, AttachMoney, Spa } from '@mui/icons-material';

export default function TechniciansPage() {
  const technicians = useLiveTechnicians();

  const totalCompleted = technicians.reduce((sum, t) => sum + t.todayCompletedCount, 0);
  const totalRevenue = technicians.reduce((sum, t) => sum + t.todayRevenue, 0);
  const idleCount = technicians.filter((t) => t.status === 'idle').length;
  const servingCount = technicians.filter((t) => t.status === 'serving').length;

  const animatedCompleted = useAnimatedNumber(totalCompleted);
  const animatedRevenue = useAnimatedNumber(totalRevenue);

  const stats = [
    { label: '美甲师总数', value: technicians.length, icon: People, color: '#D4A574' },
    { label: '空闲中', value: idleCount, icon: Spa, color: '#A8D8D0' },
    { label: '服务中', value: servingCount, icon: TrendingUp, color: '#E8A87F' },
    { label: '今日总营收', value: animatedRevenue, prefix: '¥', icon: AttachMoney, color: '#4A3728' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
            mb: 1,
          }}
        >
          美甲师状态管理
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          实时掌握每位美甲师的工作状态与业绩情况
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              sx={{
                p: 3,
                borderRadius: '18px',
                background: '#fff',
                border: '1px solid rgba(212, 165, 116, 0.1)',
                boxShadow: '0 4px 12px rgba(74, 55, 40, 0.04)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: `${stat.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon sx={{ fontSize: 24, color: stat.color }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#8B7D75', fontSize: '0.8125rem' }}>
                  {stat.label}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: stat.color,
                }}
              >
                {stat.prefix}
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                {stat.label === '今日总营收' || stat.label === '美甲师总数' ? (
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#8B7D75', ml: 0.5 }}
                  >
                    {stat.label === '今日总营收' ? '' : '人'}
                  </Typography>
                ) : (
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#8B7D75', ml: 0.5 }}
                  >
                    人
                  </Typography>
                )}
              </Typography>
              {stat.label === '美甲师总数' && (
                <Typography variant="caption" sx={{ color: '#8B7D75', display: 'block', mt: 0.5 }}>
                  今日完成 {animatedCompleted} 单
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 600,
          color: '#4A3728',
          mb: 3,
        }}
      >
        美甲师列表
      </Typography>

      <Grid container spacing={3}>
        {technicians.map((tech, index) => (
          <Grid item xs={12} sm={6} lg={4} key={tech.id}>
            <TechnicianCard technician={tech} index={index} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
