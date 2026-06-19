import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Avatar,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Warning, AccessTime } from '@mui/icons-material';
import { useAppointmentStore } from '../../store/appointmentStore';
import { maskPhone } from '../../utils/dateUtils';

export default function LateAlertModal() {
  const { appointments, showLateAlert, dismissLateAlert, lateAppointmentIds } =
    useAppointmentStore();

  const lateAppointments = appointments.filter(
    (apt) => lateAppointmentIds.includes(apt.id) && apt.isLate
  );

  return (
    <AnimatePresence>
      {showLateAlert && lateAppointments.length > 0 && (
        <Dialog
          open={showLateAlert}
          onClose={dismissLateAlert}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '24px',
              boxShadow: '0 24px 64px rgba(232, 138, 127, 0.25)',
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #E88A7F 0%, #F5C4BE 100%)',
                  boxShadow: '0 8px 20px rgba(232, 138, 127, 0.35)',
                }}
              >
                <Warning sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.375rem',
                    fontWeight: 600,
                    color: '#4A3728',
                  }}
                >
                  顾客迟到提醒
                </Typography>
                <Typography variant="body2" sx={{ color: '#8B7D75' }}>
                  以下顾客已迟到超过15分钟
                </Typography>
              </Box>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ px: 3, pb: 2 }}>
            <List
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{ p: 0 }}
            >
              {lateAppointments.map((apt, index) => (
                <ListItem
                  key={apt.id}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  sx={{
                    px: 0,
                    py: 1.5,
                    borderBottom:
                      index < lateAppointments.length - 1
                        ? '1px solid rgba(232, 138, 127, 0.12)'
                        : 'none',
                    gap: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      background: 'linear-gradient(135deg, #F8E8EC 0%, #E8CCD3 100%)',
                      color: '#D06B5E',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                    }}
                  >
                    {apt.customerName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, color: '#4A3728', fontSize: '0.9375rem' }}>
                        {apt.customerName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: '6px',
                          background: 'rgba(232, 138, 127, 0.15)',
                          color: '#D06B5E',
                          fontWeight: 600,
                        }}
                      >
                        迟到{apt.lateMinutes}分钟
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: '#8B7D75' }} />
                        <Typography variant="caption" sx={{ color: '#6B5D55' }}>
                          预约 {apt.startTime}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#8B7D75' }}>
                        {maskPhone(apt.customerPhone)}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Phone sx={{ fontSize: 16 }} />}
                    sx={{
                      borderRadius: '10px',
                      borderColor: 'rgba(232, 138, 127, 0.3)',
                      color: '#D06B5E',
                      fontSize: '0.8125rem',
                      px: 2,
                      '&:hover': {
                        borderColor: '#E88A7F',
                        background: 'rgba(232, 138, 127, 0.06)',
                      },
                    }}
                  >
                    致电确认
                  </Button>
                </ListItem>
              ))}
            </List>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
            <Button
              onClick={dismissLateAlert}
              sx={{
                borderRadius: '12px',
                px: 3,
                py: 1.25,
                color: '#8B7D75',
                fontSize: '0.875rem',
                '&:hover': { background: 'rgba(139, 125, 117, 0.08)' },
              }}
            >
              稍后处理
            </Button>
            <Button
              variant="contained"
              onClick={dismissLateAlert}
              sx={{
                borderRadius: '12px',
                px: 4,
                py: 1.25,
                background: 'linear-gradient(135deg, #E88A7F 0%, #F5C4BE 100%)',
                boxShadow: '0 8px 20px rgba(232, 138, 127, 0.35)',
                fontSize: '0.875rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D06B5E 0%, #E88A7F 100%)',
                  boxShadow: '0 12px 28px rgba(232, 138, 127, 0.45)',
                },
              }}
            >
              我知道了
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
