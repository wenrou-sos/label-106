import {
  User,
  Technician,
  Appointment,
  ColorSwatch,
  Customer,
  WorkPhoto,
  ServiceItem,
  TechnicianSchedule,
  DayOfWeek,
  DaySchedule,
  WorkShift,
  DEFAULT_WORK_START,
  DEFAULT_WORK_END,
  LUNCH_BREAK_START,
  LUNCH_BREAK_END,
} from '../types';
import { formatDate, addTimeMinutes } from '../utils/dateUtils';
import { startOfWeek, addDays } from 'date-fns';

const today = formatDate(new Date());

const getWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(addDays(weekStart, i)));
  }
  return dates;
};

const weekDates = getWeekDates();

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'admin',
    name: '李店长',
    role: 'owner',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    phone: '13800138000',
  },
  {
    id: 'u2',
    username: 'reception',
    name: '王前台',
    role: 'receptionist',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    phone: '13800138001',
  },
  {
    id: 'u3',
    username: 'tech1',
    name: '张美甲师',
    role: 'technician',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    phone: '13800138002',
  },
];

export const mockServices: ServiceItem[] = [
  { id: 's1', type: 'manicure', name: '基础美甲', duration: 60, price: 128 },
  { id: 's2', type: 'manicure', name: '光疗美甲', duration: 90, price: 258 },
  { id: 's3', type: 'eyelash', name: '美睫嫁接', duration: 120, price: 388 },
  { id: 's4', type: 'removal', name: '卸甲服务', duration: 30, price: 58 },
  { id: 's5', type: 'extension', name: '指甲延长', duration: 150, price: 458 },
  { id: 's6', type: 'correction', name: 'Q甲矫正', duration: 90, price: 298 },
  { id: 's7', type: 'pedicure', name: '脚部护理', duration: 90, price: 198 },
];

export const mockTechnicians: Technician[] = [
  {
    id: 't1',
    name: '张小美',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    status: 'serving',
    todayCompletedCount: 3,
    todayRevenue: 854,
  },
  {
    id: 't2',
    name: '李婷婷',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face',
    status: 'idle',
    todayCompletedCount: 2,
    todayRevenue: 516,
  },
  {
    id: 't3',
    name: '王莉莉',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face',
    status: 'break',
    todayCompletedCount: 4,
    todayRevenue: 1032,
  },
  {
    id: 't4',
    name: '陈思思',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    status: 'off',
    todayCompletedCount: 0,
    todayRevenue: 0,
  },
  {
    id: 't5',
    name: '刘梦琪',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    status: 'idle',
    todayCompletedCount: 1,
    todayRevenue: 258,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    customerId: 'c1',
    customerName: '赵女士',
    customerPhone: '13911112222',
    serviceId: 's2',
    serviceName: '光疗美甲',
    serviceType: 'manicure',
    technicianId: 't1',
    technicianName: '张小美',
    startTime: '09:30',
    endTime: addTimeMinutes('09:30', 90),
    date: today,
    status: 'completed',
    isLate: false,
  },
  {
    id: 'a2',
    customerId: 'c2',
    customerName: '孙小姐',
    customerPhone: '13933334444',
    serviceId: 's3',
    serviceName: '美睫嫁接',
    serviceType: 'eyelash',
    technicianId: 't3',
    technicianName: '王莉莉',
    startTime: '10:00',
    endTime: addTimeMinutes('10:00', 120),
    date: today,
    status: 'completed',
    isLate: false,
  },
  {
    id: 'a3',
    customerId: 'c3',
    customerName: '周女士',
    customerPhone: '13955556666',
    serviceId: 's1',
    serviceName: '基础美甲',
    serviceType: 'manicure',
    technicianId: 't1',
    technicianName: '张小美',
    startTime: '11:30',
    endTime: addTimeMinutes('11:30', 60),
    date: today,
    status: 'serving',
    isLate: false,
  },
  {
    id: 'a4',
    customerId: 'c4',
    customerName: '吴小姐',
    customerPhone: '13977778888',
    serviceId: 's5',
    serviceName: '指甲延长',
    serviceType: 'extension',
    technicianId: 't2',
    technicianName: '李婷婷',
    startTime: '13:00',
    endTime: addTimeMinutes('13:00', 150),
    date: today,
    status: 'confirmed',
    isLate: false,
  },
  {
    id: 'a5',
    customerId: 'c5',
    customerName: '郑女士',
    customerPhone: '13999990000',
    serviceId: 's7',
    serviceName: '脚部护理',
    serviceType: 'pedicure',
    technicianId: 't5',
    technicianName: '刘梦琪',
    startTime: '14:00',
    endTime: addTimeMinutes('14:00', 90),
    date: today,
    status: 'late',
    isLate: true,
    lateMinutes: 25,
  },
  {
    id: 'a6',
    customerId: 'c6',
    customerName: '钱小姐',
    customerPhone: '13811112222',
    serviceId: 's6',
    serviceName: 'Q甲矫正',
    serviceType: 'correction',
    technicianId: 't2',
    technicianName: '李婷婷',
    startTime: '15:30',
    endTime: addTimeMinutes('15:30', 90),
    date: today,
    status: 'pending',
    isLate: false,
  },
  {
    id: 'a7',
    customerId: 'c1',
    customerName: '赵女士',
    customerPhone: '13911112222',
    serviceId: 's4',
    serviceName: '卸甲服务',
    serviceType: 'removal',
    technicianId: 't3',
    technicianName: '王莉莉',
    startTime: '16:00',
    endTime: addTimeMinutes('16:00', 30),
    date: today,
    status: 'pending',
    isLate: false,
  },
  {
    id: 'a8',
    customerId: 'c7',
    customerName: '冯女士',
    customerPhone: '13833334444',
    serviceId: 's2',
    serviceName: '光疗美甲',
    serviceType: 'manicure',
    technicianId: 't1',
    technicianName: '张小美',
    startTime: '17:00',
    endTime: addTimeMinutes('17:00', 90),
    date: today,
    status: 'confirmed',
    isLate: false,
  },
  {
    id: 'a9',
    customerId: 'c8',
    customerName: '陈小姐',
    customerPhone: '13855556666',
    serviceId: 's3',
    serviceName: '美睫嫁接',
    serviceType: 'eyelash',
    technicianId: 't5',
    technicianName: '刘梦琪',
    startTime: '19:00',
    endTime: addTimeMinutes('19:00', 120),
    date: today,
    status: 'confirmed',
    isLate: false,
  },
];

const generateWeeklyAppointments = (): Appointment[] => {
  const weeklyApts: Appointment[] = [];
  const templates = [
    { customerId: 'c1', customerName: '赵女士', customerPhone: '13911112222', serviceId: 's1', serviceName: '基础美甲', serviceType: 'manicure' as const, technicianId: 't1', technicianName: '张小美', startTime: '10:00', duration: 60 },
    { customerId: 'c2', customerName: '孙小姐', customerPhone: '13933334444', serviceId: 's3', serviceName: '美睫嫁接', serviceType: 'eyelash' as const, technicianId: 't3', technicianName: '王莉莉', startTime: '11:30', duration: 120 },
    { customerId: 'c3', customerName: '周女士', customerPhone: '13955556666', serviceId: 's2', serviceName: '光疗美甲', serviceType: 'manicure' as const, technicianId: 't1', technicianName: '张小美', startTime: '14:00', duration: 90 },
    { customerId: 'c4', customerName: '吴小姐', customerPhone: '13977778888', serviceId: 's5', serviceName: '指甲延长', serviceType: 'extension' as const, technicianId: 't2', technicianName: '李婷婷', startTime: '15:30', duration: 150 },
    { customerId: 'c5', customerName: '郑女士', customerPhone: '13999990000', serviceId: 's7', serviceName: '脚部护理', serviceType: 'pedicure' as const, technicianId: 't5', technicianName: '刘梦琪', startTime: '09:30', duration: 90 },
    { customerId: 'c6', customerName: '钱小姐', customerPhone: '13811112222', serviceId: 's6', serviceName: 'Q甲矫正', serviceType: 'correction' as const, technicianId: 't2', technicianName: '李婷婷', startTime: '13:00', duration: 90 },
    { customerId: 'c7', customerName: '冯女士', customerPhone: '13833334444', serviceId: 's4', serviceName: '卸甲服务', serviceType: 'removal' as const, technicianId: 't3', technicianName: '王莉莉', startTime: '16:30', duration: 30 },
    { customerId: 'c8', customerName: '陈小姐', customerPhone: '13855556666', serviceId: 's2', serviceName: '光疗美甲', serviceType: 'manicure' as const, technicianId: 't1', technicianName: '张小美', startTime: '17:30', duration: 90 },
  ];

  const todayStr = formatDate(new Date());

  weekDates.forEach((date, dateIndex) => {
    if (date >= todayStr) return;

    const dayApts = templates.slice(0, 4 + (dateIndex % 4));
    dayApts.forEach((tpl, aptIndex) => {
      weeklyApts.push({
        id: `wa_${dateIndex}_${aptIndex}`,
        customerId: tpl.customerId,
        customerName: tpl.customerName,
        customerPhone: tpl.customerPhone,
        serviceId: tpl.serviceId,
        serviceName: tpl.serviceName,
        serviceType: tpl.serviceType,
        technicianId: tpl.technicianId,
        technicianName: tpl.technicianName,
        startTime: tpl.startTime,
        endTime: addTimeMinutes(tpl.startTime, tpl.duration),
        date,
        status: 'completed',
        isLate: false,
      });
    });
  });

  return weeklyApts;
};

export const allAppointments: Appointment[] = [...mockAppointments, ...generateWeeklyAppointments()];

export const mockColorSwatches: ColorSwatch[] = [
  {
    id: 'col1',
    brand: 'OPI',
    code: 'NL W52',
    name: '经典玫瑰红',
    hexColor: '#C2185B',
    tags: ['hot'],
    inStock: true,
  },
  {
    id: 'col2',
    brand: 'OPI',
    code: 'NL T69',
    name: '裸粉奶茶',
    hexColor: '#E8C4B8',
    tags: ['hot'],
    inStock: true,
  },
  {
    id: 'col3',
    brand: 'OPI',
    code: 'NL F88',
    name: '樱桃红',
    hexColor: '#D32F2F',
    tags: [],
    inStock: true,
  },
  {
    id: 'col4',
    brand: 'CND',
    code: 'VP 001',
    name: '法式白',
    hexColor: '#F5F5F5',
    tags: [],
    inStock: true,
  },
  {
    id: 'col5',
    brand: 'CND',
    code: 'VP 045',
    name: '蔓越莓',
    hexColor: '#AD1457',
    tags: ['hot', 'restocking'],
    inStock: false,
  },
  {
    id: 'col6',
    brand: 'CND',
    code: 'VP 120',
    name: '薄荷绿',
    hexColor: '#A8D8D0',
    tags: [],
    inStock: true,
  },
  {
    id: 'col7',
    brand: 'Gelish',
    code: 'GH 012',
    name: '复古酒红',
    hexColor: '#880E4F',
    tags: [],
    inStock: true,
  },
  {
    id: 'col8',
    brand: 'Gelish',
    code: 'GH 088',
    name: '香芋紫',
    hexColor: '#9575CD',
    tags: ['expired'],
    inStock: false,
    expiryDate: '2025-12-31',
  },
  {
    id: 'col9',
    brand: 'Gelish',
    code: 'GH 156',
    name: '焦糖棕',
    hexColor: '#8D6E63',
    tags: ['hot'],
    inStock: true,
  },
  {
    id: 'col10',
    brand: 'KADS',
    code: 'KD 203',
    name: '雾霾蓝',
    hexColor: '#78909C',
    tags: [],
    inStock: true,
  },
  {
    id: 'col11',
    brand: 'KADS',
    code: 'KD 318',
    name: '柠檬黄',
    hexColor: '#FFD54F',
    tags: ['restocking'],
    inStock: false,
  },
  {
    id: 'col12',
    brand: 'KADS',
    code: 'KD 456',
    name: '极光黑',
    hexColor: '#212121',
    tags: [],
    inStock: true,
  },
  {
    id: 'col13',
    brand: 'OPI',
    code: 'NL B29',
    name: '深海蓝',
    hexColor: '#1565C0',
    tags: [],
    inStock: true,
  },
  {
    id: 'col14',
    brand: 'CND',
    code: 'VP 201',
    name: '金属银',
    hexColor: '#BDBDBD',
    tags: ['hot'],
    inStock: true,
  },
  {
    id: 'col15',
    brand: 'Gelish',
    code: 'GH 299',
    name: '樱花粉',
    hexColor: '#F8BBD9',
    tags: ['expired'],
    inStock: false,
    expiryDate: '2025-10-15',
  },
  {
    id: 'col16',
    brand: 'KADS',
    code: 'KD 520',
    name: '珊瑚橙',
    hexColor: '#FF8A65',
    tags: [],
    inStock: true,
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    name: '赵女士',
    phone: '13911112222',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1995-06-15',
    firstVisit: '2024-03-10',
    totalVisits: 12,
    totalSpent: 3568,
    notes: '喜欢裸色系，过敏体质，对某些胶水敏感',
  },
  {
    id: 'c2',
    name: '孙小姐',
    phone: '13933334444',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1998-11-22',
    firstVisit: '2024-06-01',
    totalVisits: 6,
    totalSpent: 2128,
  },
  {
    id: 'c3',
    name: '周女士',
    phone: '13955556666',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1990-02-08',
    firstVisit: '2023-12-15',
    totalVisits: 18,
    totalSpent: 5240,
    notes: 'VIP客户，偏好张小美美甲师',
  },
  {
    id: 'c4',
    name: '吴小姐',
    phone: '13977778888',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1997-09-30',
    firstVisit: '2025-01-20',
    totalVisits: 3,
    totalSpent: 894,
  },
  {
    id: 'c5',
    name: '郑女士',
    phone: '13999990000',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1988-04-12',
    firstVisit: '2024-08-05',
    totalVisits: 9,
    totalSpent: 3102,
  },
  {
    id: 'c6',
    name: '钱小姐',
    phone: '13811112222',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '2000-12-25',
    firstVisit: '2025-03-15',
    totalVisits: 4,
    totalSpent: 1192,
  },
  {
    id: 'c7',
    name: '冯女士',
    phone: '13833334444',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1992-07-18',
    firstVisit: '2024-09-10',
    totalVisits: 7,
    totalSpent: 2486,
  },
  {
    id: 'c8',
    name: '陈小姐',
    phone: '13855556666',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    gender: 'female',
    birthday: '1996-05-03',
    firstVisit: '2025-02-08',
    totalVisits: 5,
    totalSpent: 1940,
  },
];

export const mockWorkPhotos: WorkPhoto[] = [
  {
    id: 'wp1',
    customerId: 'c1',
    appointmentId: 'a1',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
    serviceType: 'manicure',
    createdAt: '2025-06-10 11:30',
    description: '玫瑰金渐变美甲',
  },
  {
    id: 'wp2',
    customerId: 'c1',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop',
    serviceType: 'manicure',
    createdAt: '2025-05-20 15:45',
    description: '法式美甲',
  },
  {
    id: 'wp3',
    customerId: 'c2',
    appointmentId: 'a2',
    imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=400&fit=crop',
    serviceType: 'eyelash',
    createdAt: '2025-06-12 14:00',
    description: '自然款美睫',
  },
  {
    id: 'wp4',
    customerId: 'c3',
    imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop',
    serviceType: 'manicure',
    createdAt: '2025-06-05 10:20',
    description: '猫眼石美甲',
  },
  {
    id: 'wp5',
    customerId: 'c3',
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
    serviceType: 'pedicure',
    createdAt: '2025-05-28 16:30',
    description: '脚部护理 + 酒红色',
  },
  {
    id: 'wp6',
    customerId: 'c5',
    imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop',
    serviceType: 'extension',
    createdAt: '2025-06-08 13:15',
    description: '延长甲 + 裸色系',
  },
];

const createDefaultDaySchedule = (): DaySchedule => ({
  isDayOff: false,
  shifts: [
    { startTime: DEFAULT_WORK_START, endTime: LUNCH_BREAK_START },
    { startTime: LUNCH_BREAK_END, endTime: DEFAULT_WORK_END },
  ],
});

const createPartTimeMorning = (): DaySchedule => ({
  isDayOff: false,
  shifts: [{ startTime: DEFAULT_WORK_START, endTime: LUNCH_BREAK_START }],
});

const createPartTimeAfternoon = (): DaySchedule => ({
  isDayOff: false,
  shifts: [{ startTime: LUNCH_BREAK_END, endTime: DEFAULT_WORK_END }],
});

const createDayOff = (): DaySchedule => ({
  isDayOff: true,
  shifts: [] as WorkShift[],
});

const createDefaultWeekSchedule = (): Record<DayOfWeek, DaySchedule> => ({
  0: createDefaultDaySchedule(),
  1: createDefaultDaySchedule(),
  2: createDefaultDaySchedule(),
  3: createDefaultDaySchedule(),
  4: createDefaultDaySchedule(),
  5: createDefaultDaySchedule(),
  6: createDayOff(),
});

export const mockSchedules: TechnicianSchedule[] = [
  {
    technicianId: 't1',
    weekSchedule: {
      ...createDefaultWeekSchedule(),
      3: {
        isDayOff: false,
        shifts: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '14:00', endTime: '18:00' },
        ],
      },
    },
  },
  {
    technicianId: 't2',
    weekSchedule: {
      ...createDefaultWeekSchedule(),
      2: createDayOff(),
      5: createPartTimeMorning(),
    },
  },
  {
    technicianId: 't3',
    weekSchedule: {
      ...createDefaultWeekSchedule(),
      1: createPartTimeAfternoon(),
      4: createDayOff(),
    },
  },
  {
    technicianId: 't4',
    weekSchedule: {
      0: createPartTimeMorning(),
      1: createPartTimeMorning(),
      2: createDayOff(),
      3: createPartTimeMorning(),
      4: createPartTimeMorning(),
      5: createDefaultDaySchedule(),
      6: createDayOff(),
    },
  },
  {
    technicianId: 't5',
    weekSchedule: {
      ...createDefaultWeekSchedule(),
      6: createDefaultDaySchedule(),
      0: createDayOff(),
    },
  },
];
