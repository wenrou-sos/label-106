import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Drawer,
  IconButton,
  Divider,
  Chip,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomerStore } from '../store/customerStore';
import { useAppointmentStore } from '../store/appointmentStore';
import CustomerCard from '../components/customers/CustomerCard';
import WorkGallery from '../components/customers/WorkGallery';
import PhotoUploader from '../components/customers/PhotoUploader';
import AppointmentNotesDialog from '../components/appointments/AppointmentNotesDialog';
import {
  Search,
  Close,
  CalendarToday,
  AttachMoney,
  Phone,
  Person,
  Favorite,
  Collections,
  AddAPhoto,
  NoteAlt,
  AccessTime,
  ContentCut,
  EditNote,
} from '@mui/icons-material';
import { Customer, WorkPhoto, Appointment } from '../types';
import { maskPhone } from '../utils/dateUtils';
import { SERVICE_TYPE_LABELS, APPOINTMENT_STATUS_LABELS } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ pt: 3 }}
    >
      {value === index && children}
    </Box>
  );
}

export default function CustomersPage() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    selectedCustomer,
    setSelectedCustomer,
    addWorkPhoto,
    getCustomerPhotos,
  } = useCustomerStore();
  const { appointments, updateNotes } = useAppointmentStore();

  const [tabValue, setTabValue] = useState(0);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalVisits = customers.reduce((sum, c) => sum + c.totalVisits, 0);
  const totalPhotos = useCustomerStore((s) => s.workPhotos).length;

  const customerPhotos = selectedCustomer ? getCustomerPhotos(selectedCustomer.id) : [];

  const customerAppointments = useMemo(() => {
    if (!selectedCustomer) return [];
    return appointments
      .filter((apt) => apt.customerId === selectedCustomer.id)
      .sort((a, b) => {
        if (a.date !== b.date) return b.date.localeCompare(a.date);
        return b.startTime.localeCompare(a.startTime);
      });
  }, [appointments, selectedCustomer]);

  const customerNotesList = useMemo(() => {
    return customerAppointments.filter((apt) => apt.notes && apt.notes.trim().length > 0);
  }, [customerAppointments]);

  const stats = [
    { label: '顾客总数', value: totalCustomers, icon: Person, color: '#D4A574' },
    { label: '总到店次数', value: totalVisits, icon: CalendarToday, color: '#A8D8D0' },
    { label: '累计消费', value: totalSpent, prefix: '¥', icon: AttachMoney, color: '#4A3728' },
    { label: '作品照片', value: totalPhotos, icon: Collections, color: '#E88A7F' },
  ];

  const handleAddWorkPhoto = (photo: WorkPhoto) => {
    addWorkPhoto(photo);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenNotesDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotesDialogOpen(true);
  };

  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleSaveNotes = (id: string, notes: string) => {
    updateNotes(id, notes);
  };

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
          顾客档案与作品管理
        </Typography>
        <Typography variant="body1" sx={{ color: '#8B7D75' }}>
          管理顾客信息与历史作品，提供更优质的个性化服务
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
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <Box
            sx={{
              position: 'sticky',
              top: 88,
            }}
          >
            <TextField
              fullWidth
              placeholder="搜索顾客姓名或手机号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '14px',
                  background: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(212, 165, 116, 0.2)',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#8B7D75' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Typography
              variant="caption"
              sx={{ color: '#8B7D75', display: 'block', mb: 2, fontWeight: 500 }}
            >
              顾客列表 (共 {filteredCustomers.length} 位)
            </Typography>

            <Box
              sx={{
                maxHeight: 'calc(100vh - 280px)',
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: 4,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(212, 165, 116, 0.3)',
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredCustomers.length === 0 ? (
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      borderRadius: '16px',
                      background: 'rgba(248, 232, 236, 0.3)',
                      border: '1px dashed rgba(212, 165, 116, 0.2)',
                    }}
                  >
                    <Person sx={{ fontSize: 40, color: '#D4A574', mb: 1.5 }} />
                    <Typography sx={{ color: '#8B7D75', fontSize: '0.875rem' }}>
                      未找到匹配的顾客
                    </Typography>
                  </Box>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <CustomerCard
                      key={customer.id}
                      customer={customer}
                      index={index}
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setTabValue(0);
                      }}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <AnimatePresence mode="wait">
            {selectedCustomer ? (
              <Box
                component={motion.div}
                key="customer-detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CustomerDetailPanel
                  customer={selectedCustomer}
                  photos={customerPhotos}
                  appointments={customerAppointments}
                  notesList={customerNotesList}
                  tabValue={tabValue}
                  onTabChange={handleTabChange}
                  onAddPhoto={handleAddWorkPhoto}
                  onEditNotes={handleOpenNotesDialog}
                />
              </Box>
            ) : (
              <Box
                component={motion.div}
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{
                  py: 16,
                  textAlign: 'center',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(248, 232, 236, 0.3) 0%, rgba(212, 165, 116, 0.06) 100%)',
                  border: '1px dashed rgba(212, 165, 116, 0.2)',
                }}
              >
                <Favorite sx={{ fontSize: 56, color: '#D4A574', mb: 3 }} />
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#4A3728',
                    mb: 1,
                  }}
                >
                  选择一位顾客查看详情
                </Typography>
                <Typography variant="body1" sx={{ color: '#8B7D75' }}>
                  从左侧列表中选择顾客，查看档案信息与历史作品
                </Typography>
              </Box>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>

      <AppointmentNotesDialog
        open={notesDialogOpen}
        appointment={selectedAppointment}
        onClose={handleCloseNotesDialog}
        onSave={handleSaveNotes}
      />
    </Box>
  );
}

interface CustomerDetailPanelProps {
  customer: Customer;
  photos: WorkPhoto[];
  appointments: Appointment[];
  notesList: Appointment[];
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onAddPhoto: (photo: WorkPhoto) => void;
  onEditNotes: (appointment: Appointment) => void;
}

function CustomerDetailPanel({
  customer,
  photos,
  appointments,
  notesList,
  tabValue,
  onTabChange,
  onAddPhoto,
  onEditNotes,
}: CustomerDetailPanelProps) {
  return (
    <Box>
      <Box
        sx={{
          p: 4,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FFF8F5 0%, #FDF5F0 100%)',
          border: '1px solid rgba(212, 165, 116, 0.15)',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '24px',
              backgroundImage: `url(${customer.avatar})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '3px solid #fff',
              boxShadow: '0 8px 24px rgba(74, 55, 40, 0.12)',
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 600,
                color: '#4A3728',
                mb: 0.5,
              }}
            >
              {customer.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Phone sx={{ fontSize: 16, color: '#8B7D75' }} />
              <Typography variant="body2" sx={{ color: '#8B7D75' }}>
                {maskPhone(customer.phone)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`${customer.totalVisits} 次到店`}
                size="small"
                sx={{
                  background: 'rgba(168, 216, 208, 0.2)',
                  color: '#3E8E82',
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: 24,
                }}
              />
              <Chip
                label={`累计 ¥${customer.totalSpent.toLocaleString()}`}
                size="small"
                sx={{
                  background: 'rgba(212, 165, 116, 0.2)',
                  color: '#9A6F42',
                  fontWeight: 600,
                  borderRadius: '8px',
                  height: 24,
                }}
              />
              <Chip
                label={`首次到店 ${customer.firstVisit}`}
                size="small"
                sx={{
                  background: 'rgba(248, 232, 236, 0.6)',
                  color: '#A06B75',
                  fontWeight: 500,
                  borderRadius: '8px',
                  height: 24,
                }}
              />
            </Box>
          </Box>
        </Box>

        {customer.notes && (
          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: '14px',
              background: '#fff',
              border: '1px solid rgba(212, 165, 116, 0.1)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#8B7D75', display: 'block', mb: 0.75, fontWeight: 500 }}
            >
              顾客备注
            </Typography>
            <Typography sx={{ color: '#4A3728', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {customer.notes}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          p: 1,
          borderRadius: '16px',
          background: 'rgba(212, 165, 116, 0.06)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={onTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #D4A574 0%, #E8C9A0 100%)',
              height: 3,
              borderRadius: 2,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: '#8B7D75',
              borderRadius: '12px',
              mx: 0.5,
              minHeight: 44,
              '&.Mui-selected': {
                color: '#4A3728',
              },
            },
          }}
        >
          <Tab
            icon={<Collections sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={`作品照片 (${photos.length})`}
          />
          <Tab
            icon={<AddAPhoto sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="上传作品"
          />
          <Tab
            icon={<NoteAlt sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label={`历史备注 (${notesList.length})`}
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <WorkGallery photos={photos} />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <PhotoUploader onUpload={onAddPhoto} customerId={customer.id} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <CustomerNotesHistory
          notesList={notesList}
          appointments={appointments}
          onEditNotes={onEditNotes}
        />
      </TabPanel>
    </Box>
  );
}

interface CustomerNotesHistoryProps {
  notesList: Appointment[];
  appointments: Appointment[];
  onEditNotes: (appointment: Appointment) => void;
}

function CustomerNotesHistory({
  notesList,
  appointments,
  onEditNotes,
}: CustomerNotesHistoryProps) {
  const allAptsWithNotesBtn = appointments;

  if (notesList.length === 0 && appointments.length === 0) {
    return (
      <Box
        sx={{
          py: 12,
          textAlign: 'center',
          borderRadius: '16px',
          background: 'rgba(248, 232, 236, 0.3)',
          border: '1px dashed rgba(212, 165, 116, 0.2)',
        }}
      >
        <NoteAlt sx={{ fontSize: 48, color: '#D4A574', mb: 2 }} />
        <Typography
          sx={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#4A3728',
            mb: 1,
          }}
        >
          暂无历史记录
        </Typography>
        <Typography variant="body2" sx={{ color: '#8B7D75' }}>
          该顾客还没有预约记录，也没有任何备注信息
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notesList.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #C9A8E8 0%, #E8D5F5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <NoteAlt sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#4A3728',
              }}
            >
              重要备注汇总 ({notesList.length}条)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notesList.map((apt) => (
              <Box
                key={apt.id}
                sx={{
                  p: 2.5,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(201,168,232,0.1) 0%, rgba(248,232,236,0.3) 100%)',
                  border: '1px solid rgba(201, 168, 232, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={apt.date}
                      size="small"
                      sx={{
                        height: 22,
                        background: '#fff',
                        color: '#9A6F42',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(212, 165, 116, 0.2)',
                      }}
                    />
                    <Chip
                      label={`${apt.startTime}-${apt.endTime}`}
                      size="small"
                      sx={{
                        height: 22,
                        background: 'rgba(168, 216, 208, 0.15)',
                        color: '#3E8E82',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                      }}
                    />
                    <Chip
                      label={apt.technicianName}
                      size="small"
                      sx={{
                        height: 22,
                        background: 'rgba(212, 165, 116, 0.15)',
                        color: '#9A6F42',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                      }}
                    />
                    <Chip
                      label={SERVICE_TYPE_LABELS[apt.serviceType]}
                      size="small"
                      sx={{
                        height: 22,
                        background: 'rgba(248, 232, 236, 0.6)',
                        color: '#A06B75',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                      }}
                    />
                    <Chip
                      label={APPOINTMENT_STATUS_LABELS[apt.status]}
                      size="small"
                      sx={{
                        height: 22,
                        background:
                          apt.status === 'completed'
                            ? 'rgba(168, 216, 208, 0.2)'
                            : apt.status === 'cancelled'
                            ? 'rgba(139, 125, 117, 0.15)'
                            : 'rgba(212, 165, 116, 0.2)',
                        color:
                          apt.status === 'completed'
                            ? '#3E8E82'
                            : apt.status === 'cancelled'
                            ? '#8B7D75'
                            : '#9A6F42',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => onEditNotes(apt)}
                    sx={{
                      width: 28,
                      height: 28,
                      minWidth: 28,
                      background: 'rgba(255,255,255,0.8)',
                      color: '#7A5D94',
                      borderRadius: '8px',
                      ml: 1,
                      flexShrink: 0,
                      '&:hover': {
                        background: '#fff',
                        color: '#5E4A78',
                      },
                    }}
                  >
                    <EditNote sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Typography
                  sx={{
                    color: '#4A3728',
                    fontSize: '0.9375rem',
                    lineHeight: 1.7,
                    fontWeight: 500,
                  }}
                >
                  {apt.notes}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              background: 'rgba(212, 165, 116, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarToday sx={{ fontSize: 18, color: '#D4A574' }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#4A3728',
            }}
          >
            全部预约记录 ({allAptsWithNotesBtn.length}次)
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: '16px',
            background: '#fff',
            border: '1px solid rgba(212, 165, 116, 0.1)',
            overflow: 'hidden',
          }}
        >
          {allAptsWithNotesBtn.map((apt, idx) => (
            <Box key={apt.id}>
              <Box
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  '&:hover': {
                    background: 'rgba(212, 165, 116, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    flex: '0 0 90px',
                    pt: 0.25,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#D4A574',
                      mb: 0.25,
                    }}
                  >
                    {apt.date.slice(5)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8B7D75' }}>
                    {apt.startTime}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: '#4A3728',
                        fontSize: '0.9375rem',
                      }}
                    >
                      {apt.serviceName}
                    </Typography>
                    <Chip
                      label={SERVICE_TYPE_LABELS[apt.serviceType]}
                      size="small"
                      sx={{
                        height: 20,
                        background: 'rgba(248, 232, 236, 0.5)',
                        color: '#A06B75',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                      }}
                    />
                    <Chip
                      label={APPOINTMENT_STATUS_LABELS[apt.status]}
                      size="small"
                      sx={{
                        height: 20,
                        background:
                          apt.status === 'completed'
                            ? 'rgba(168, 216, 208, 0.15)'
                            : apt.status === 'cancelled'
                            ? 'rgba(139, 125, 117, 0.1)'
                            : 'rgba(212, 165, 116, 0.15)',
                        color:
                          apt.status === 'completed'
                            ? '#3E8E82'
                            : apt.status === 'cancelled'
                            ? '#8B7D75'
                            : '#9A6F42',
                        fontWeight: 500,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: apt.notes ? 1 : 0 }}>
                    <Person sx={{ fontSize: 14, color: '#8B7D75' }} />
                    <Typography variant="caption" sx={{ color: '#6B5D55' }}>
                      {apt.technicianName}
                    </Typography>
                    <Box sx={{ mx: 0.5, width: 3, height: 3, borderRadius: 1.5, background: '#D4D0CB' }} />
                    <AccessTime sx={{ fontSize: 14, color: '#8B7D75' }} />
                    <Typography variant="caption" sx={{ color: '#6B5D55' }}>
                      {apt.startTime} - {apt.endTime}
                    </Typography>
                  </Box>
                  {apt.notes ? (
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '10px',
                        background: 'rgba(201, 168, 232, 0.08)',
                        border: '1px dashed rgba(201, 168, 232, 0.25)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <NoteAlt sx={{ fontSize: 14, color: '#9E7DB8', mt: 0.25, flexShrink: 0 }} />
                      <Typography
                        variant="caption"
                        sx={{ color: '#7A5D94', fontSize: '0.8125rem', lineHeight: 1.6, flex: 1 }}
                      >
                        {apt.notes}
                      </Typography>
                    </Box>
                  ) : null}
                </Box>
                <Box sx={{ flexShrink: 0, pt: 0.25 }}>
                  <Tooltip title={apt.notes ? '编辑备注' : '添加备注'} placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onEditNotes(apt)}
                      sx={{
                        width: 32,
                        height: 32,
                        minWidth: 32,
                        background: apt.notes
                          ? 'rgba(201, 168, 232, 0.1)'
                          : 'rgba(212, 165, 116, 0.08)',
                        color: apt.notes ? '#9E7DB8' : '#D4A574',
                        borderRadius: '10px',
                        '&:hover': {
                          background: apt.notes
                            ? 'rgba(201, 168, 232, 0.2)'
                            : 'rgba(212, 165, 116, 0.15)',
                        },
                      }}
                    >
                      <NoteAlt sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              {idx < allAptsWithNotesBtn.length - 1 && (
                <Divider sx={{ mx: 2.5, borderColor: 'rgba(212, 165, 116, 0.08)' }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
