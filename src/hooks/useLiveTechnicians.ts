import { useMemo } from 'react';
import { useTechnicianStore } from '../store/technicianStore';
import { useAppointmentStore } from '../store/appointmentStore';
import { useScheduleStore, isTimeInShift } from '../store/scheduleStore';
import { useRealtimeClock } from './useRealtimeClock';
import { Technician, TechnicianStatus } from '../types';
import { formatDate } from '../utils/dateUtils';

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

export function useLiveTechnicians(): Technician[] {
  const { technicians } = useTechnicianStore();
  const { appointments } = useAppointmentStore();
  const { getDaySchedule } = useScheduleStore();
  const now = useRealtimeClock();

  const liveTechnicians = useMemo(() => {
    const todayStr = formatDate(now);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return technicians.map((tech) => {
      const daySchedule = getDaySchedule(tech.id, todayStr);

      if (!daySchedule || daySchedule.isDayOff) {
        return { ...tech, status: 'off' as TechnicianStatus };
      }

      const isWorkingHours = daySchedule.shifts.some((shift) => {
        const startMinutes = timeToMinutes(shift.startTime);
        const endMinutes = timeToMinutes(shift.endTime);
        return currentMinutes >= startMinutes && currentMinutes < endMinutes;
      });

      if (!isWorkingHours) {
        return { ...tech, status: 'off' as TechnicianStatus };
      }

      const hasActiveAppointment = appointments.some((apt) => {
        if (apt.technicianId !== tech.id) return false;
        if (apt.date !== todayStr) return false;
        if (apt.status === 'cancelled' || apt.status === 'completed') return false;

        const aptStartMinutes = timeToMinutes(apt.startTime);
        const aptEndMinutes = timeToMinutes(apt.endTime);

        return currentMinutes >= aptStartMinutes && currentMinutes < aptEndMinutes;
      });

      if (hasActiveAppointment) {
        return { ...tech, status: 'serving' as TechnicianStatus };
      }

      return { ...tech, status: 'idle' as TechnicianStatus };
    });
  }, [technicians, appointments, now, getDaySchedule]);

  return liveTechnicians;
}
