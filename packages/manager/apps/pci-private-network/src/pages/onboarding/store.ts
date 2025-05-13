import { create } from 'zustand';

interface VrackCreationState {
  operationId: string;
  setOperationId: (id: string) => void;
}

export const useVrackCreationOperation = create<VrackCreationState>((set) => ({
  operationId: null,
  setOperationId: (id: string) => set({ operationId: id }),
}));
