import { create } from 'zustand';
import { Appointment, AppointmentStatus, ServiceType, SERVICE_TYPE_LABELS } from '../types';
import { allAppointments, mockServices } from '../data/mockData';
import { isLate, calculateLateMinutes, formatDate } from '../utils/dateUtils';
import { format, startOfWeek, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export interface DailyRevenue {
  date: string;
  label: string;
  revenue: number;
}

export interface ServiceStat {
  type: ServiceType;
  label: string;
  count: number;
  revenue: number;
  color: string;
}

export interface TodayOverview {
  totalAppointments: number;
  completedCount: number;
  cancelledCount: number;
  avgPrice: number;
  totalRevenue: number;
}

interface AppointmentState {
  appointments: Appointment[];
  selectedDate: string;
  lateAppointmentIds: string[];
  showLateAlert: boolean;
  setSelectedDate: (date: string) => void;
  addAppointment: (appointment: Appointment) => void;
  updateStatus: (id: string, status: AppointmentStatus) => void;
  checkLateAppointments: () => void;
  dismissLateAlert: () => void;
  getWeeklyRevenue: () => DailyRevenue[];
  getServiceStats: () => ServiceStat[];
  getTodayOverview: () => TodayOverview;
}

const SERVICE_COLORS: Record<ServiceType, string> = {
  manicure: '#D4A574',
  eyelash: '#E8A87F',
  removal: '#A8D8D0',
  extension: '#C9A8E8',
  correction: '#E8C9A0',
  pedicure: '#F8BBD9',
};

const getServicePrice = (serviceId: string): number => {
  const service = mockServices.find((s) => s.id === serviceId);
  return service?.price || 0;
};

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: allAppointments,
  selectedDate: formatDate(new Date()),
  lateAppointmentIds: [],
  showLateAlert: false,

  setSelectedDate: (date: string) => set({ selectedDate: date }),

  addAppointment: (appointment: Appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),

  updateStatus: (id: string, status: AppointmentStatus) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      ),
    })),

  checkLateAppointments: () => {
    const { appointments, selectedDate, lateAppointmentIds, showLateAlert } = get();
    const now = new Date();

    const currentLateIds: string[] = [];

    const updatedAppointments = appointments.map((apt) => {
      if (apt.date !== selectedDate) return apt;
      if (apt.status === 'completed' || apt.status === 'cancelled') return apt;

      const late = isLate(apt.startTime, apt.date, 15, now);
      const lateMins = calculateLateMinutes(apt.startTime, apt.date, now);

      if (late) {
        currentLateIds.push(apt.id);
      }

      return {
        ...apt,
        isLate: late,
        lateMinutes: lateMins > 0 ? lateMins : undefined,
        status: late && apt.status !== 'arrived' && apt.status !== 'serving' ? 'late' : apt.status,
      };
    });

    const isFirstCheck = lateAppointmentIds.length === 0;
    const newLateIds = currentLateIds.filter((id) => !lateAppointmentIds.includes(id));
    const hasNewLate = newLateIds.length > 0;
    const shouldShowAlert = hasNewLate || (isFirstCheck && currentLateIds.length > 0 && !showLateAlert);

    set({
      appointments: updatedAppointments,
      lateAppointmentIds: currentLateIds,
      showLateAlert: shouldShowAlert ? true : get().showLateAlert,
    });
  },

  dismissLateAlert: () => set({ showLateAlert: false }),

  getWeeklyRevenue: (): DailyRevenue[] => {
    const { appointments } = get();
    const result: DailyRevenue[] = [];
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = formatDate(date);
      const dayApts = appointments.filter(
        (apt) => apt.date === dateStr && apt.status === 'completed'
      );
      const revenue = dayApts.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
      const isToday = formatDate(today) === dateStr;

      result.push({
        date: dateStr,
        label: isToday ? '今天' : format(date, 'EEE', { locale: zhCN }),
        revenue,
      });
    }

    return result;
  },

  getServiceStats: (): ServiceStat[] => {
    const { appointments } = get();
    const stats = new Map<ServiceType, { count: number; revenue: number }>();

    const validApts = appointments.filter((apt) => apt.status === 'completed');

    validApts.forEach((apt) => {
      const existing = stats.get(apt.serviceType) || { count: 0, revenue: 0 };
      stats.set(apt.serviceType, {
        count: existing.count + 1,
        revenue: existing.revenue + getServicePrice(apt.serviceId),
      });
    });

    const result: ServiceStat[] = [];
    stats.forEach((value, type) => {
      result.push({
        type,
        label: SERVICE_TYPE_LABELS[type],
        count: value.count,
        revenue: value.revenue,
        color: SERVICE_COLORS[type],
      });
    });

    return result.sort((a, b) => b.revenue - a.revenue);
  },

  getTodayOverview: (): TodayOverview => {
    const { appointments, selectedDate } = get();
    const todayApts = appointments.filter((apt) => apt.date === selectedDate);

    const totalAppointments = todayApts.length;
    const completedCount = todayApts.filter((apt) => apt.status === 'completed').length;
    const cancelledCount = todayApts.filter((apt) => apt.status === 'cancelled').length;
    const paidApts = todayApts.filter((apt) => apt.status === 'completed');
    const totalRevenue = paidApts.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
    const avgPrice = paidApts.length > 0 ? Math.round(totalRevenue / paidApts.length) : 0;

    return {
      totalAppointments,
      completedCount,
      cancelledCount,
      avgPrice,
      totalRevenue,
    };
  },
}));
