import { create } from 'zustand';
import { getDay } from 'date-fns';
import {
  TechnicianSchedule,
  DayOfWeek,
  DaySchedule,
  WorkShift,
  DEFAULT_WORK_START,
  DEFAULT_WORK_END,
  LUNCH_BREAK_START,
  LUNCH_BREAK_END,
} from '../types';
import { mockSchedules } from '../data/mockData';
import { generateTimeSlots } from '../utils/dateUtils';

const STORAGE_KEY = 'nail-salon-schedules';

const loadSchedules = (): TechnicianSchedule[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return mockSchedules;
};

const persistSchedules = (schedules: TechnicianSchedule[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch {
    // ignore storage errors
  }
};

const createDefaultDaySchedule = (): DaySchedule => ({
  isDayOff: false,
  shifts: [
    { startTime: DEFAULT_WORK_START, endTime: LUNCH_BREAK_START },
    { startTime: LUNCH_BREAK_END, endTime: DEFAULT_WORK_END },
  ],
});

const createDefaultWeekSchedule = (): Record<DayOfWeek, DaySchedule> => ({
  0: createDefaultDaySchedule(),
  1: createDefaultDaySchedule(),
  2: createDefaultDaySchedule(),
  3: createDefaultDaySchedule(),
  4: createDefaultDaySchedule(),
  5: createDefaultDaySchedule(),
  6: { isDayOff: true, shifts: [] },
});

interface ScheduleState {
  schedules: TechnicianSchedule[];
  getTechnicianSchedule: (technicianId: string) => TechnicianSchedule | undefined;
  getDaySchedule: (technicianId: string, dateStr: string) => DaySchedule | undefined;
  isTimeSlotAvailable: (technicianId: string, dateStr: string, time: string, duration: number) => boolean;
  getAvailableTimeSlots: (technicianId: string, dateStr: string, duration: number) => string[];
  updateDaySchedule: (technicianId: string, dayOfWeek: DayOfWeek, schedule: DaySchedule) => void;
  toggleDayOff: (technicianId: string, dayOfWeek: DayOfWeek) => void;
  updateShift: (technicianId: string, dayOfWeek: DayOfWeek, shiftIndex: number, shift: WorkShift) => void;
  addShift: (technicianId: string, dayOfWeek: DayOfWeek, shift: WorkShift) => void;
  removeShift: (technicianId: string, dayOfWeek: DayOfWeek, shiftIndex: number) => void;
  resetToDefault: (technicianId: string) => void;
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isTimeInShift = (time: string, shift: WorkShift): boolean => {
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(shift.startTime);
  const endMinutes = timeToMinutes(shift.endTime);
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

const isTimeRangeInShift = (startTime: string, duration: number, shift: WorkShift): boolean => {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + duration;
  const shiftStartMinutes = timeToMinutes(shift.startTime);
  const shiftEndMinutes = timeToMinutes(shift.endTime);
  return startMinutes >= shiftStartMinutes && endMinutes <= shiftEndMinutes;
};

const getDayOfWeekFromDate = (dateStr: string): DayOfWeek => {
  const date = new Date(dateStr);
  const jsDay = getDay(date);
  return ((jsDay + 6) % 7) as DayOfWeek;
};

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: loadSchedules(),

  getTechnicianSchedule: (technicianId: string) => {
    return get().schedules.find((s) => s.technicianId === technicianId);
  },

  getDaySchedule: (technicianId: string, dateStr: string) => {
    const schedule = get().getTechnicianSchedule(technicianId);
    if (!schedule) return undefined;
    const dayOfWeek = getDayOfWeekFromDate(dateStr);
    return schedule.weekSchedule[dayOfWeek];
  },

  isTimeSlotAvailable: (technicianId: string, dateStr: string, time: string, duration: number) => {
    const daySchedule = get().getDaySchedule(technicianId, dateStr);
    if (!daySchedule || daySchedule.isDayOff) return false;
    return daySchedule.shifts.some((shift) => isTimeRangeInShift(time, duration, shift));
  },

  getAvailableTimeSlots: (technicianId: string, dateStr: string, duration: number) => {
    const daySchedule = get().getDaySchedule(technicianId, dateStr);
    if (!daySchedule || daySchedule.isDayOff) return [];

    const allSlots = generateTimeSlots(9, 21, 30);
    return allSlots.filter((slot) =>
      daySchedule.shifts.some((shift) => isTimeRangeInShift(slot, duration, shift))
    );
  },

  updateDaySchedule: (technicianId: string, dayOfWeek: DayOfWeek, schedule: DaySchedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.technicianId === technicianId
          ? {
              ...s,
              weekSchedule: {
                ...s.weekSchedule,
                [dayOfWeek]: schedule,
              },
            }
          : s
      ),
    })),

  toggleDayOff: (technicianId: string, dayOfWeek: DayOfWeek) =>
    set((state) => ({
      schedules: state.schedules.map((s) => {
        if (s.technicianId !== technicianId) return s;
        const day = s.weekSchedule[dayOfWeek];
        const newIsDayOff = !day.isDayOff;
        return {
          ...s,
          weekSchedule: {
            ...s.weekSchedule,
            [dayOfWeek]: {
              ...day,
              isDayOff: newIsDayOff,
              shifts:
                !newIsDayOff && day.shifts.length === 0
                  ? createDefaultDaySchedule().shifts
                  : day.shifts,
            },
          },
        };
      }),
    })),

  updateShift: (technicianId: string, dayOfWeek: DayOfWeek, shiftIndex: number, shift: WorkShift) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.technicianId === technicianId
          ? {
              ...s,
              weekSchedule: {
                ...s.weekSchedule,
                [dayOfWeek]: {
                  ...s.weekSchedule[dayOfWeek],
                  shifts: s.weekSchedule[dayOfWeek].shifts.map((sh, i) =>
                    i === shiftIndex ? shift : sh
                  ),
                },
              },
            }
          : s
      ),
    })),

  addShift: (technicianId: string, dayOfWeek: DayOfWeek, shift: WorkShift) =>
    set((state) => ({
      schedules: state.schedules.map((s) => {
        if (s.technicianId !== technicianId) return s;
        const day = s.weekSchedule[dayOfWeek];
        const newShifts = [...day.shifts, shift];
        return {
          ...s,
          weekSchedule: {
            ...s.weekSchedule,
            [dayOfWeek]: {
              ...day,
              shifts: newShifts,
              isDayOff: newShifts.length === 0,
            },
          },
        };
      }),
    })),

  removeShift: (technicianId: string, dayOfWeek: DayOfWeek, shiftIndex: number) =>
    set((state) => ({
      schedules: state.schedules.map((s) => {
        if (s.technicianId !== technicianId) return s;
        const day = s.weekSchedule[dayOfWeek];
        const newShifts = day.shifts.filter((_, i) => i !== shiftIndex);
        return {
          ...s,
          weekSchedule: {
            ...s.weekSchedule,
            [dayOfWeek]: {
              ...day,
              shifts: newShifts,
              isDayOff: newShifts.length === 0,
            },
          },
        };
      }),
    })),

  resetToDefault: (technicianId: string) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.technicianId === technicianId
          ? {
              ...s,
              weekSchedule: createDefaultWeekSchedule(),
            }
          : s
      ),
    })),
}));

useScheduleStore.subscribe((state) => persistSchedules(state.schedules));

export { createDefaultDaySchedule, createDefaultWeekSchedule, isTimeInShift, getDayOfWeekFromDate };
