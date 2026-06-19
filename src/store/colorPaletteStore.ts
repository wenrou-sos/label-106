import { create } from 'zustand';
import { ColorSwatch } from '../types';
import { mockColorSwatches } from '../data/mockData';

interface ColorPaletteState {
  colors: ColorSwatch[];
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
}

export const useColorPaletteStore = create<ColorPaletteState>((set) => ({
  colors: mockColorSwatches,
  selectedBrand: null,

  setSelectedBrand: (brand: string | null) => set({ selectedBrand: brand }),
}));
