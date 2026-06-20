import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { TrendingUp, CalendarViewWeek } from '@mui/icons-material';
import { DailyRevenue } from '../../store/appointmentStore';

interface RevenueChartProps {
  data: DailyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / data.length);

  const chartData = data.map((d) => ({
    label: d.label,
    revenue: d.revenue,
  }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      sx={{
        p: 3,
        borderRadius: '20px',
        background: '#fff',
        border: '1px solid rgba(212, 165, 116, 0.1)',
        boxShadow: '0 4px 12px rgba(74, 55, 40, 0.04)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CalendarViewWeek sx={{ fontSize: 20, color: '#D4A574' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: '#4A3728',
              }}
            >
              本周营收趋势
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            过去7天每日营收统计
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', mb: 0.5 }}>
            <TrendingUp sx={{ fontSize: 16, color: '#A8D8D0' }} />
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#4A3728',
              }}
            >
              ¥{totalRevenue.toLocaleString()}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            本周合计 · 日均 ¥{avgRevenue.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 240 }}>
        <BarChart
          dataset={chartData}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'label',
              tickLabelStyle: { fill: '#8B7D75', fontSize: 12 },
              tickSize: 0,
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: { fill: '#8B7D75', fontSize: 11 },
              tickSize: 2,
            },
          ]}
          series={[
            {
              dataKey: 'revenue',
              label: '营收',
              highlightScope: { highlighted: 'item', faded: 'global' },
              valueFormatter: (value: number | null) => `¥${value?.toLocaleString() || 0}`,
              color: '#D4A574',
            },
          ]}
          borderRadius={8}
          grid={{ horizontal: true, vertical: false }}
          height={240}
          sx={{
            [`.${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-10px, 0)',
            },
            [`.${axisClasses.root}`]: {
              [`.${axisClasses.line}`]: {
                stroke: 'rgba(212, 165, 116, 0.2)',
              },
              [`.${axisClasses.tickLabel}`]: {
                fontFamily: 'inherit',
              },
            },
            '& .MuiChartsGrid-line': {
              stroke: 'rgba(212, 165, 116, 0.08)',
              strokeDasharray: '4 4',
            },
            '& .MuiBarElement-root': {
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                filter: 'brightness(1.1)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
