import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { Appointment, SERVICE_TYPE_LABELS } from '../../types';
import { NoteAltOutlined, Close, AccessTime, Person, ContentCut } from '@mui/icons-material';

interface AppointmentNotesDialogProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (id: string, notes: string) => void;
}

export default function AppointmentNotesDialog({
  open,
  appointment,
  onClose,
  onSave,
}: AppointmentNotesDialogProps) {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (appointment) {
      setNotes(appointment.notes || '');
    }
  }, [appointment]);

  const handleSave = () => {
    if (appointment) {
      onSave(appointment.id, notes);
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: '#FAF7F5',
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(212,165,116,0.2) 0%, rgba(248,232,236,0.5) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NoteAltOutlined sx={{ color: '#D4A574', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#4A3728',
              }}
            >
              预约备注
            </Typography>
            <Typography variant="caption" sx={{ color: '#8B7D75' }}>
              记录顾客特殊要求、过敏信息等
            </Typography>
          </Box>
        </Box>
        <Button
          onClick={handleClose}
          sx={{
            minWidth: 36,
            width: 36,
            height: 36,
            borderRadius: '10px',
            color: '#8B7D75',
            '&:hover': {
              background: 'rgba(139,125,117,0.1)',
            },
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: '14px',
            background: '#fff',
            border: '1px solid rgba(212, 165, 116, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Person sx={{ fontSize: 16, color: '#8B7D75' }} />
            <Typography variant="body2" sx={{ color: '#4A3728', fontWeight: 600 }}>
              {appointment.customerName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8B7D75', ml: 'auto' }}>
              {appointment.customerPhone}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <ContentCut sx={{ fontSize: 16, color: '#8B7D75' }} />
            <Typography variant="body2" sx={{ color: '#6B5D55' }}>
              {SERVICE_TYPE_LABELS[appointment.serviceType]} · {appointment.serviceName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime sx={{ fontSize: 16, color: '#8B7D75' }} />
            <Typography variant="body2" sx={{ color: '#6B5D55' }}>
              {appointment.date} · {appointment.startTime} - {appointment.endTime}
            </Typography>
            <Chip
              label={appointment.technicianName}
              size="small"
              sx={{
                ml: 'auto',
                height: 22,
                background: 'rgba(168, 216, 208, 0.2)',
                color: '#3E8E82',
                fontWeight: 500,
                borderRadius: '8px',
                fontSize: '0.7rem',
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{ color: '#8B7D75', display: 'block', mb: 1, fontWeight: 500 }}
        >
          备注内容
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={5}
          placeholder="例如：对紫外线过敏，请使用防紫外线底油；偏好浅色系；上次做了延长，这次只需补色..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
              background: '#fff',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              '& fieldset': {
                borderColor: 'rgba(212, 165, 116, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(212, 165, 116, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#D4A574',
              },
            },
          }}
        />

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: '12px',
            background: 'rgba(248, 232, 236, 0.4)',
            border: '1px dashed rgba(200, 139, 150, 0.3)',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: '#A06B75', fontWeight: 600, display: 'block', mb: 0.5 }}
          >
            💡 提示
          </Typography>
          <Typography variant="caption" sx={{ color: '#8B7D75', lineHeight: 1.6 }}>
            建议记录：过敏史、特殊日期、偏好颜色/款式、禁忌服务、上次服务情况等。顾客档案中可查看历史备注汇总。
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '12px',
            color: '#8B7D75',
            fontWeight: 500,
            '&:hover': {
              background: 'rgba(139,125,117,0.1)',
            },
          }}
        >
          取消
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disableElevation
          sx={{
            px: 4,
            py: 1,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
            color: '#fff',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(212, 165, 116, 0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #C89B6A 0%, #DDB991 100%)',
            },
          }}
        >
          保存备注
        </Button>
      </DialogActions>
    </Dialog>
  );
}
