import { create } from 'zustand';
import { IPTypeEnum, StepIdsEnum, TFormState, TStepState } from '@/api/types';

type Store = {
  form: TFormState;
  steps: Map<StepIdsEnum, TStepState>;
  setSteps: (param: Map<StepIdsEnum, TStepState>) => void;
  openStep: (step: StepIdsEnum) => void;
  closeStep: (step: StepIdsEnum) => void;
  setForm: (newForm: TFormState) => void;
  closeAllSteps: () => void;
};

export const useOrderStore = create<Store>()((set) => {
  return {
    form: {
      ipType: IPTypeEnum.FAILOVER,
      failoverCountry: null,
      floatingRegion: null,
      instance: null,
      ipAddress: null,
      floatingGatewaySize: null,
    },
    steps: new Map(),
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
  };
});
