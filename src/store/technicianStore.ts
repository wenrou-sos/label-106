import { create } from 'zustand';
import { Technician, TechnicianStatus } from '../types';
import { mockTechnicians } from '../data/mockData';

interface TechnicianState {
  technicians: Technician[];
  updateTechnicianStatus: (id: string, status: TechnicianStatus) => void;
  incrementCompletedCount: (id: string, revenue: number) => void;
}

export const useTechnicianStore = create<TechnicianState>((set) => ({
  technicians: mockTechnicians,

  updateTechnicianStatus: (id: string, status: TechnicianStatus) =>
    set((state) => ({
      technicians: state.technicians.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),

  incrementCompletedCount: (id: string, revenue: number) =>
    set((state) => ({
      technicians: state.technicians.map((t) =>
        t.id === id
          ? {
              ...t,
              todayCompletedCount: t.todayCompletedCount + 1,
              todayRevenue: t.todayRevenue + revenue,
            }
          : t
      ),
    })),
}));
