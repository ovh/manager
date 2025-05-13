import { create } from 'zustand';

interface AppState {
  region: 'EU' | 'CA' | 'US';
  setRegion: (region: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  region: null,
  setRegion: (region: AppState['region']) => set({ region }),
}));
