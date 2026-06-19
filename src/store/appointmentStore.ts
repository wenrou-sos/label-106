import { create } from 'zustand';
import { Appointment, AppointmentStatus } from '../types';
import { mockAppointments } from '../data/mockData';
import { isLate, calculateLateMinutes, formatDate } from '../utils/dateUtils';

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
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: mockAppointments,
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
    const { appointments, selectedDate, lateAppointmentIds } = get();
    const now = new Date();
    const newLateIds: string[] = [];

    const updatedAppointments = appointments.map((apt) => {
      if (apt.date !== selectedDate) return apt;
      if (apt.status === 'completed' || apt.status === 'cancelled') return apt;

      const late = isLate(apt.startTime, apt.date, 15, now);
      const lateMins = calculateLateMinutes(apt.startTime, apt.date, now);

      if (late && !apt.isLate) {
        newLateIds.push(apt.id);
      }

      return {
        ...apt,
        isLate: late,
        lateMinutes: lateMins > 0 ? lateMins : undefined,
        status: late && apt.status !== 'arrived' && apt.status !== 'serving' ? 'late' : apt.status,
      };
    });

    const hasNewLate = newLateIds.length > 0;
    const allLateIds = [...new Set([...lateAppointmentIds, ...newLateIds])];

    set({
      appointments: updatedAppointments,
      lateAppointmentIds: allLateIds,
      showLateAlert: hasNewLate ? true : get().showLateAlert,
    });
  },

  dismissLateAlert: () => set({ showLateAlert: false }),
}));
