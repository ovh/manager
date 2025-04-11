import { create } from 'zustand';
import { StepIdsEnum, TFormState, TStepState } from '@/api/types';

type Store = {
  form: TFormState;
  steps: Map<StepIdsEnum, TStepState>;
  setSteps: (param: Map<StepIdsEnum, TStepState>) => void;
  openStep: (step: StepIdsEnum) => void;
  closeStep: (step: StepIdsEnum) => void;
  setForm: (newForm: TFormState) => void;
  closeAllSteps: () => void;
  floatingIpCreation: boolean;
  setFloatingIpCreation: () => void;
  reset: () => void;
};

const initialState = {
  form: {
    ipType: null,
    failoverCountry: null,
    floatingRegion: null,
    instance: null,
    ipAddress: null,
    floatingGatewaySize: null,
    isSubmitting: false,
  },
  steps: new Map(),
};

export const useOrderStore = create<Store>()((set) => {
  return {
    ...initialState,
    setSteps: (newSteps: Map<StepIdsEnum, TStepState>) => {
      set(() => {
        return {
          steps: newSteps,
        };
      });
    },
    closeAllSteps: () => {
      set((state) => {
        const $steps = new Map(state.steps);
        $steps.forEach((value, key) => {
          $steps.set(key, { ...value, open: false });
        });
        return {
          steps: $steps,
        };
      });
    },
    openStep: (step: StepIdsEnum) => {
      set((state) => {
        const $steps = new Map(state.steps);
        const value = $steps.get(step);
        $steps.set(step, { ...value, open: true });

        return {
          steps: $steps,
        };
      });
    },
    closeStep: (step: StepIdsEnum) => {
      set((state) => {
        const $steps = new Map(state.steps);
        const value = $steps.get(step);
        $steps.set(step, { ...value, open: false });

        return {
          steps: $steps,
        };
      });
    },
    setForm: (newForm: TFormState) =>
      set((state) => {
        return {
          ...state,
          form: { ...newForm },
        };
      }),
    floatingIpCreation: false,
    setFloatingIpCreation: () =>
      set((state) => ({
        ...state,
        floatingIpCreation: true,
      })),
    reset: () => set(initialState),
  };
});
