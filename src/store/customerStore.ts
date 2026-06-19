import { create } from 'zustand';
import { Customer, WorkPhoto } from '../types';
import { mockCustomers, mockWorkPhotos } from '../data/mockData';

interface CustomerState {
  customers: Customer[];
  workPhotos: WorkPhoto[];
  selectedCustomer: Customer | null;
  searchQuery: string;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSearchQuery: (query: string) => void;
  addWorkPhoto: (photo: WorkPhoto) => void;
  getCustomerPhotos: (customerId: string) => WorkPhoto[];
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: mockCustomers,
  workPhotos: mockWorkPhotos,
  selectedCustomer: null,
  searchQuery: '',

  setSelectedCustomer: (customer: Customer | null) =>
    set({ selectedCustomer: customer }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  addWorkPhoto: (photo: WorkPhoto) =>
    set((state) => ({
      workPhotos: [...state.workPhotos, photo],
    })),

  getCustomerPhotos: (customerId: string) => {
    const { workPhotos } = get();
    return workPhotos.filter((p) => p.customerId === customerId);
  },
}));
