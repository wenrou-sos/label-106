import { Box, Typography, Grid, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppointmentStore } from '../store/appointmentStore';
import { useTechnicianStore } from '../store/technicianStore';
import Timeline from '../components/appointments/Timeline';
import TechnicianCard from '../components/technicians/TechnicianCard';
import LateAlertModal from '../components/appointments/LateAlertModal';
import TodayOverview from '../components/dashboard/TodayOverview';
import RevenueChart from '../components/dashboard/RevenueChart';
import ServicePieChart from '../components/dashboard/ServicePieChart';
import { CalendarToday, TrendingUp, People, AttachMoney } from '@mui/icons-material';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function DashboardPage() {
  const { appointments, selectedDate, getWeeklyRevenue, getServiceStats, getTodayOverview } =
    useAppointmentStore();
  const { technicians } = useTechnicianStore();

  const todayAppointments = appointments.filter((apt) => apt.date === selectedDate);
  const completedToday = todayAppointments.filter((apt) => apt.status === 'completed').length;
  const totalRevenue = technicians.reduce((sum, t) => sum + t.todayRevenue, 0);
  const servingNow = technicians.filter((t) => t.status === 'serving').length;
  const idleCount = technicians.filter((t) => t.status === 'idle').length;

  const animatedRevenue = useAnimatedNumber(totalRevenue);
  const animatedAppointments = useAnimatedNumber(todayAppointments.length);
  const animatedCompleted = useAnimatedNumber(completedToday);

  const weeklyRevenue = getWeeklyRevenue();
  const serviceStats = getServiceStats();
  const todayOverview = getTodayOverview();

  const stats = [
    {
      label: '今日预约',
      value: animatedAppointments,
      suffix: '单',
      icon: CalendarToday,
      gradient: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
      bg: 'rgba(212, 165, 116, 0.1)',
    },
    {
      label: '已完成',
      value: animatedCompleted,
      suffix: '单',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #A8D8D0 0%, #D0EBE6 100%)',
      bg: 'rgba(168, 216, 208, 0.15)',
    },
    {
      label: '服务中',
      value: servingNow,
      suffix: `人 (空闲${idleCount}人)`,
      icon: People,
      gradient: 'linear-gradient(135deg, #F8E8EC 0%, #E8CCD3 100%)',
      bg: 'rgba(248, 232, 236, 0.4)',
    },
    {
      label: '今日营收',
      value: animatedRevenue,
      prefix: '¥',
      suffix: '',
      icon: AttachMoney,
      gradient: 'linear-gradient(135deg, #E8A87F 0%, #F5CFB8 100%)',
      bg: 'rgba(232, 168, 127, 0.12)',
    },
  ];

  return (
    <Box>
      <LateAlertModal />

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              color: '#4A3728',
            }}
          >
            {format(new Date(), 'M月d日 EEEE', { locale: zhCN })}
          </Typography>
          <Chip
            label={todayAppointments.length + ' 个预约'}
            sx={{
              height: 28,
              px: 1,
              background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.8125rem',
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          一切井然有序，祝您今天工作愉快 ✨
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.label}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              sx={{
                p: 3,
                borderRadius: '20px',
                background: '#fff',
                border: '1px solid rgba(212, 165, 116, 0.1)',
                boxShadow: '0 4px 12px rgba(74, 55, 40, 0.04)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 32px rgba(74, 55, 40, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="caption" sx={{ color: '#8B7D75', fontSize: '0.8125rem' }}>
                  {stat.label}
                </Typography>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <stat.icon
                    sx={{
                      fontSize: 22,
                      background: stat.gradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  />
                </Box>
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#4A3728',
                  lineHeight: 1,
                }}
              >
                {stat.prefix}
                {stat.value.toLocaleString()}
                <Typography
                  component="span"
                  sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#8B7D75', ml: 0.5 }}
                >
                  {stat.suffix}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <TodayOverview data={todayOverview} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <RevenueChart data={weeklyRevenue} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <ServicePieChart data={serviceStats} />
        </Grid>
      </Grid>

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
            今日预约时间轴
          </Typography>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            9:00 - 21:00 · 半小时间隔
          </Typography>
        </Box>
        <Timeline />
      </Box>

      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
            mb: 3,
          }}
        >
          美甲师实时状态
        </Typography>
        <Grid container spacing={3}>
          {technicians.map((tech, index) => (
            <Grid item xs={12} sm={6} lg={4} xl={2.4} key={tech.id}>
              <TechnicianCard technician={tech} index={index} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
