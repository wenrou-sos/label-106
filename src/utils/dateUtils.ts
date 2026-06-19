import {
  format,
  parse,
  addMinutes,
  differenceInMinutes,
  isToday,
} from 'date-fns';

export const TIME_FORMAT = 'HH:mm';
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';

export function formatTime(date: Date): string {
  return format(date, TIME_FORMAT);
}

export function formatDate(date: Date): string {
  return format(date, DATE_FORMAT);
}

export function parseTime(timeStr: string, baseDate: Date = new Date()): Date {
  return parse(timeStr, TIME_FORMAT, baseDate);
}

export function addTimeMinutes(timeStr: string, minutes: number): string {
  const date = parseTime(timeStr);
  return formatTime(addMinutes(date, minutes));
}

export function generateTimeSlots(
  startHour = 9,
  endHour = 21,
  intervalMinutes = 30
): string[] {
  const slots: string[] = [];
  const startDate = new Date();
  startDate.setHours(startHour, 0, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHour, 0, 0, 0);

  let current = new Date(startDate);
  while (current <= endDate) {
    slots.push(formatTime(current));
    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}

export function calculateLateMinutes(
  startTime: string,
  dateStr: string,
  now: Date = new Date()
): number {
  const appointmentDate = parse(dateStr, DATE_FORMAT, new Date());
  const [hours, minutes] = startTime.split(':').map(Number);
  appointmentDate.setHours(hours, minutes, 0, 0);

  if (!isToday(appointmentDate)) {
    return 0;
  }

  return Math.max(0, differenceInMinutes(now, appointmentDate));
}

export function isLate(
  startTime: string,
  dateStr: string,
  thresholdMinutes = 15,
  now: Date = new Date()
): boolean {
  return calculateLateMinutes(startTime, dateStr, now) > thresholdMinutes;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}
