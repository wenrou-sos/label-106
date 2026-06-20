export type UserRole = 'owner' | 'receptionist' | 'technician';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar: string;
  phone?: string;
}

export type ServiceType =
  | 'manicure'
  | 'eyelash'
  | 'removal'
  | 'extension'
  | 'correction'
  | 'pedicure';

export interface ServiceItem {
  id: string;
  type: ServiceType;
  name: string;
  duration: number;
  price: number;
}

export type TechnicianStatus = 'idle' | 'serving' | 'break' | 'off';

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  status: TechnicianStatus;
  todayCompletedCount: number;
  todayRevenue: number;
}

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'arrived'
  | 'serving'
  | 'completed'
  | 'cancelled'
  | 'late';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  technicianId: string;
  technicianName: string;
  startTime: string;
  endTime: string;
  date: string;
  status: AppointmentStatus;
  isLate: boolean;
  lateMinutes?: number;
  notes?: string;
}

export type ColorTag = 'hot' | 'restocking' | 'expired';

export interface ColorSwatch {
  id: string;
  brand: string;
  code: string;
  name: string;
  hexColor: string;
  tags: ColorTag[];
  inStock: boolean;
  expiryDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  gender: 'female' | 'male';
  birthday?: string;
  firstVisit: string;
  totalVisits: number;
  totalSpent: number;
  notes?: string;
}

export interface WorkPhoto {
  id: string;
  customerId: string;
  appointmentId?: string;
  imageUrl: string;
  serviceType: ServiceType;
  createdAt: string;
  description?: string;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  manicure: '美甲',
  eyelash: '美睫',
  removal: '卸甲',
  extension: '延长',
  correction: 'Q甲矫正',
  pedicure: '脚部护理',
};

export const TECHNICIAN_STATUS_LABELS: Record<TechnicianStatus, string> = {
  idle: '空闲',
  serving: '服务中',
  break: '休息',
  off: '已下班',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  arrived: '已到店',
  serving: '服务中',
  completed: '已完成',
  cancelled: '已取消',
  late: '迟到',
};

export const COLOR_TAG_LABELS: Record<ColorTag, string> = {
  hot: '本月热门',
  restocking: '补货中',
  expired: '已过期不可用',
};

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkShift {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  isDayOff: boolean;
  shifts: WorkShift[];
}

export interface TechnicianSchedule {
  technicianId: string;
  weekSchedule: Record<DayOfWeek, DaySchedule>;
}

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  0: '周一',
  1: '周二',
  2: '周三',
  3: '周四',
  4: '周五',
  5: '周六',
  6: '周日',
};

export const DEFAULT_WORK_START = '09:00';
export const DEFAULT_WORK_END = '21:00';
export const LUNCH_BREAK_START = '12:00';
export const LUNCH_BREAK_END = '13:00';
