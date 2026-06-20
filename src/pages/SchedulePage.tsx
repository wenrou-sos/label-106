import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  IconButton,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Edit,
  Delete,
  Add,
  Refresh,
  EventAvailable,
  WorkOutline,
} from '@mui/icons-material';
import { useTechnicianStore } from '../store/technicianStore';
import { useScheduleStore } from '../store/scheduleStore';
import {
  DAY_OF_WEEK_LABELS,
  DayOfWeek,
  WorkShift,
  DEFAULT_WORK_START,
  DEFAULT_WORK_END,
} from '../types';

export default function SchedulePage() {
  const { technicians } = useTechnicianStore();
  const {
    schedules,
    toggleDayOff,
    updateShift,
    addShift,
    removeShift,
    resetToDefault,
  } = useScheduleStore();

  const [selectedTechnicianId, setSelectedTechnicianId] = useState(technicians[0]?.id || '');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<DayOfWeek | null>(null);
  const [editingShiftIndex, setEditingShiftIndex] = useState<number | null>(null);
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');

  const selectedSchedule = schedules.find((s) => s.technicianId === selectedTechnicianId);
  const selectedTechnician = technicians.find((t) => t.id === selectedTechnicianId);

  const handleOpenEditDialog = (day: DayOfWeek, shiftIndex?: number, existingShift?: WorkShift) => {
    setEditingDay(day);
    setEditingShiftIndex(shiftIndex !== undefined ? shiftIndex : null);
    setShiftStartTime(existingShift?.startTime || DEFAULT_WORK_START);
    setShiftEndTime(existingShift?.endTime || DEFAULT_WORK_END);
    setEditDialogOpen(true);
  };

  const handleSaveShift = () => {
    if (editingDay === null || !shiftStartTime || !shiftEndTime) return;
    if (shiftStartTime >= shiftEndTime) return;

    const shift: WorkShift = {
      startTime: shiftStartTime,
      endTime: shiftEndTime,
    };

    if (editingShiftIndex !== null) {
      updateShift(selectedTechnicianId, editingDay, editingShiftIndex, shift);
    } else {
      addShift(selectedTechnicianId, editingDay, shift);
    }

    setEditDialogOpen(false);
  };

  const handleRemoveShift = (day: DayOfWeek, shiftIndex: number) => {
    removeShift(selectedTechnicianId, day, shiftIndex);
  };

  const handleToggleDayOff = (day: DayOfWeek) => {
    toggleDayOff(selectedTechnicianId, day);
  };

  const handleResetToDefault = () => {
    resetToDefault(selectedTechnicianId);
  };

  const days: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

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
          排班管理
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          设置每位美甲师的每周工作时段和休息日
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {technicians.map((tech, index) => {
          const isSelected = tech.id === selectedTechnicianId;
          return (
            <Grid item xs={12} sm={6} md={4} lg={2} key={tech.id} sx={{ maxWidth: '20%', flexBasis: '20%' }}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => setSelectedTechnicianId(tech.id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: '16px',
                  border: isSelected
                    ? '2px solid #D4A574'
                    : '1px solid rgba(212, 165, 116, 0.1)',
                  boxShadow: isSelected
                    ? '0 8px 24px rgba(212, 165, 116, 0.25)'
                    : '0 4px 12px rgba(74, 55, 40, 0.04)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(212,165,116,0.08) 0%, rgba(248,232,236,0.4) 100%)'
                    : '#fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(74, 55, 40, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Avatar
                    src={tech.avatar}
                    sx={{
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 1.5,
                      border: '3px solid #fff',
                      boxShadow: '0 4px 12px rgba(74, 55, 40, 0.15)',
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#4A3728',
                      fontSize: '0.9375rem',
                      mb: 0.5,
                    }}
                  >
                    {tech.name}
                  </Typography>
                  <Chip
                    size="small"
                    icon={<WorkOutline sx={{ fontSize: 14 }} />}
                    label="美甲师"
                    sx={{
                      background: 'rgba(212, 165, 116, 0.1)',
                      color: '#D4A574',
                      fontSize: '0.75rem',
                      height: 24,
                      '& .MuiChip-icon': { ml: 0.5 },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {selectedSchedule && selectedTechnician && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={selectedTechnician.avatar}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: '#4A3728',
                    fontSize: '1.125rem',
                  }}
                >
                  {selectedTechnician.name} 的排班
                </Typography>
                <Typography variant="body2" sx={{ color: '#8B7D75' }}>
                  点击日期卡片编辑工作时段
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleResetToDefault}
              sx={{
                borderColor: 'rgba(212, 165, 116, 0.3)',
                color: '#8B7D75',
                '&:hover': {
                  borderColor: '#D4A574',
                  background: 'rgba(212, 165, 116, 0.05)',
                },
              }}
            >
              重置默认排班
            </Button>
          </Box>

          <Grid container spacing={2}>
            {days.map((day, index) => {
              const daySchedule = selectedSchedule.weekSchedule[day];
              const isDayOff = daySchedule.isDayOff;

              return (
                <Grid item xs={12} sm={6} lg={3} key={day}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      borderRadius: '16px',
                      border: '1px solid rgba(212, 165, 116, 0.1)',
                      background: isDayOff
                        ? 'linear-gradient(135deg, rgba(232, 138, 127, 0.08) 0%, rgba(232, 138, 127, 0.02) 100%)'
                        : '#fff',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(212, 165, 116, 0.08)',
                        background: isDayOff
                          ? 'rgba(232, 138, 127, 0.05)'
                          : 'rgba(212, 165, 116, 0.03)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EventAvailable
                          sx={{
                            fontSize: 20,
                            color: isDayOff ? '#E88A7F' : '#D4A574',
                          }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: isDayOff ? '#E88A7F' : '#4A3728',
                          }}
                        >
                          {DAY_OF_WEEK_LABELS[day]}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: isDayOff ? '#E88A7F' : '#8B7D75' }}
                        >
                          {isDayOff ? '休息' : '上班'}
                        </Typography>
                        <Switch
                          checked={!isDayOff}
                          onChange={() => handleToggleDayOff(day)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#D4A574',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'rgba(212, 165, 116, 0.5)',
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      {isDayOff ? (
                        <Box
                          sx={{
                            py: 3,
                            textAlign: 'center',
                            color: '#E88A7F',
                          }}
                        >
                          <WorkOutline sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                          <Typography variant="body2" sx={{ color: '#E88A7F' }}>
                            本日休息
                          </Typography>
                        </Box>
                      ) : (
                        <>
                          {daySchedule.shifts.length === 0 ? (
                            <Box
                              sx={{
                                py: 2,
                                textAlign: 'center',
                                color: '#8B7D75',
                              }}
                            >
                              <Typography variant="body2" sx={{ color: '#8B7D75', mb: 1 }}>
                                暂无工作时段
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<Add />}
                                onClick={() => handleOpenEditDialog(day)}
                                sx={{
                                  color: '#D4A574',
                                  '&:hover': { background: 'rgba(212, 165, 116, 0.08)' },
                                }}
                              >
                                添加时段
                              </Button>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {daySchedule.shifts.map((shift, shiftIndex) => (
                                <Box
                                  key={shiftIndex}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1.5,
                                    borderRadius: '10px',
                                    background: 'rgba(212, 165, 116, 0.06)',
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    <Typography
                                      sx={{
                                        fontWeight: 600,
                                        color: '#4A3728',
                                        fontSize: '0.875rem',
                                      }}
                                    >
                                      {shift.startTime} - {shift.endTime}
                                    </Typography>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEditDialog(day, shiftIndex, shift)}
                                    sx={{ color: '#8B7D75', '&:hover': { color: '#D4A574' } }}
                                  >
                                    <Edit sx={{ fontSize: 16 }} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleRemoveShift(day, shiftIndex)}
                                    sx={{ color: '#8B7D75', '&:hover': { color: '#E88A7F' } }}
                                  >
                                    <Delete sx={{ fontSize: 16 }} />
                                  </IconButton>
                                </Box>
                              ))}
                              <Button
                                size="small"
                                startIcon={<Add />}
                                onClick={() => handleOpenEditDialog(day)}
                                sx={{
                                  mt: 1,
                                  color: '#D4A574',
                                  justifyContent: 'flex-start',
                                  '&:hover': { background: 'rgba(212, 165, 116, 0.08)' },
                                }}
                              >
                                添加时段
                              </Button>
                            </Box>
                          )}
                        </>
                      )}
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            minWidth: 360,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 600,
            color: '#4A3728',
            pb: 1,
          }}
        >
          {editingShiftIndex !== null ? '编辑工作时段' : '添加工作时段'}
          {editingDay !== null && (
            <Typography
              variant="body2"
              sx={{ color: '#8B7D75', fontWeight: 400, fontFamily: 'inherit', mt: 0.5 }}
            >
              {DAY_OF_WEEK_LABELS[editingDay]}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="开始时间"
              type="time"
              value={shiftStartTime}
              onChange={(e) => setShiftStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
              }}
            />
            <TextField
              label="结束时间"
              type="time"
              value={shiftEndTime}
              onChange={(e) => setShiftEndTime(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
              }}
            />
          </Box>
          {shiftStartTime >= shiftEndTime && (
            <Typography
              variant="caption"
              sx={{ color: '#E88A7F', display: 'block', mt: 1 }}
            >
              结束时间必须晚于开始时间
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: '#8B7D75' }}
          >
            取消
          </Button>
          <Button
            onClick={handleSaveShift}
            disabled={!shiftStartTime || !shiftEndTime || shiftStartTime >= shiftEndTime}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #D4A574 0%, #E8C9A0 100%)',
              borderRadius: '10px',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #C4956A 0%, #D8B990 100%)',
              },
              '&:disabled': {
                background: 'rgba(212, 165, 116, 0.3)',
              },
            }}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
