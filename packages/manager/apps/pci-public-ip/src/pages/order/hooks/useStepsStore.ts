import { create } from 'zustand';
import { StepIdsEnum, TStepState } from '@/api/types';

type Store = {
  items: Map<StepIdsEnum, TStepState>;
  setItems: (param: Map<StepIdsEnum, TStepState>) => void;

  closeAll: () => void;

  getPosteriorSteps: (id: StepIdsEnum) => StepIdsEnum[];

  open: (step: StepIdsEnum) => void;
  close: (step: StepIdsEnum) => void;

  check: (step: StepIdsEnum) => void;
  uncheck: (step: StepIdsEnum) => void;

  lock: (step: StepIdsEnum) => void;
  unlock: (step: StepIdsEnum) => void;
};

export const useStepsStore = create<Store>((set, get) => ({
  items: new Map(),
  setItems: (newItems: Map<StepIdsEnum, TStepState>) => {
    set(() => {
      return {
        items: newItems,
      };
    });
  },
  closeAll: () => {
    set((state) => {
      const newItems = new Map(state.items);
      newItems.forEach((value, key) => {
        newItems.set(key, { ...value, isOpen: false });
      });
      return {
        items: newItems,
      };
    });
  },
  open: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isOpen: true });

      return {
        items: newItems,
      };
    });
  },
  close: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isOpen: false });

      return {
        items: newItems,
      };
    });
  },
  getPosteriorSteps: (id: StepIdsEnum) => {
    const keys = [...get().items.keys()];
    return keys.filter((k) => keys.indexOf(k) > keys.indexOf(id));
  },
  check: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isChecked: true });

      return {
        items: newItems,
      };
    });
  },
  uncheck: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isChecked: false });

      return {
        items: newItems,
      };
    });
  },
  lock: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isLocked: true });

      return {
        items: newItems,
      };
    });
  },
  unlock: (step: StepIdsEnum) => {
    set((state) => {
      const newItems = new Map(state.items);
      const value = newItems.get(step);
      newItems.set(step, { ...value, isLocked: false });

      return {
        items: newItems,
      };
    });
  },
}));
