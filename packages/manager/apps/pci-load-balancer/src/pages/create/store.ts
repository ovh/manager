import { create } from 'zustand';

export type TPlan = {
  code: string;
  price: number;
  label: string;
  technicalName: string;
};

type TStep = {
  isOpen: boolean;
  isLocked: boolean;
  isChecked: boolean;
};

export enum StepsEnum {
  SIZE = 'SIZE',
  REGION = 'REGION',
}

export type TFormStore = {
  size: TPlan;
  steps: Map<StepsEnum, TStep>;
  set: {
    size: (val: TPlan) => void;
  };
  open: (step: StepsEnum) => void;
  close: (step: StepsEnum) => void;

  lock: (step: StepsEnum) => void;
  unlock: (step: StepsEnum) => void;

  check: (step: StepsEnum) => void;
  uncheck: (step: StepsEnum) => void;

  edit: (step: StepsEnum) => void;

  reset: () => void;
};

const initialSteps = () =>
  new Map<StepsEnum, TStep>([
    [
      StepsEnum.SIZE,
      {
        isOpen: true,
        isLocked: false,
        isChecked: false,
      },
    ],
    [
      StepsEnum.REGION,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      },
    ],
  ]);

export const useNewLoadBalancerStore = create<TFormStore>()((set, get) => ({
  size: null,
  steps: initialSteps(),
  set: {
    size: (val: TPlan) => {
      set({
        size: val,
      });
    },
  },
  open: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isOpen = true;
      return {
        ...state,
        steps,
      };
    });
  },
  close: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isOpen = false;
      return {
        ...state,
        steps,
      };
    });
  },
  lock: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isLocked = true;
      return {
        ...state,
        steps,
      };
    });
  },
  unlock: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isLocked = false;
      return {
        ...state,
        steps,
      };
    });
  },
  check: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isChecked = true;
      return {
        ...state,
        steps,
      };
    });
  },
  uncheck: (id: StepsEnum) => {
    set((state) => {
      const steps = new Map(state.steps);
      steps.get(id).isChecked = false;
      return {
        ...state,
        steps,
      };
    });
  },
  edit: (id: StepsEnum) => {
    switch (id) {
      case StepsEnum.SIZE:
        break;

      default:
    }
  },
  reset() {
    set(() => ({
      ...get(),
      size: null,
      steps: initialSteps(),
    }));
  },
}));
