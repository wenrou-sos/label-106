import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { PieChart } from '@mui/x-charts/PieChart';
import { PieChart as PieChartIcon, AttachMoney } from '@mui/icons-material';
import { ServiceStat } from '../../store/appointmentStore';

interface ServicePieChartProps {
  data: ServiceStat[];
}

export default function ServicePieChart({ data }: ServicePieChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data.map((item, index) => ({
    id: index,
    value: item.revenue,
    label: item.label,
    color: item.color,
  }));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
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
            <PieChartIcon sx={{ fontSize: 20, color: '#D4A574' }} />
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: '#4A3728',
              }}
            >
              服务项目占比
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#8B7D75' }}>
            各服务项目营收占比分析
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end', mb: 0.5 }}>
            <AttachMoney sx={{ fontSize: 16, color: '#A8D8D0' }} />
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
            总营收 · {totalCount} 单
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart
            series={[
              {
                data: chartData,
                cx: '50%',
                cy: '50%',
                innerRadius: 45,
                outerRadius: 75,
                paddingAngle: 3,
                highlightScope: { highlighted: 'item', faded: 'global' },
                valueFormatter: (item) => `¥${item.value?.toLocaleString() || 0}`,
              },
            ]}
            height={220}
            slotProps={{
              legend: { hidden: true },
            }}
            sx={{
              '& .MuiPieArc-root': {
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'brightness(1.1)',
                },
              },
              '& .MuiPieArcLabel-root': {
                fill: '#4A3728',
                fontSize: 11,
                fontWeight: 600,
              },
            }}
          />
        </Box>

        <Box sx={{ width: 130, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
          {data.map((item) => {
            const percentage = totalRevenue > 0 ? Math.round((item.revenue / totalRevenue) * 100) : 0;
            return (
              <Box key={item.type} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#4A3728',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#8B7D75',
                      fontSize: '0.6875rem',
                    }}
                  >
                    {percentage}% · {item.count}单
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
