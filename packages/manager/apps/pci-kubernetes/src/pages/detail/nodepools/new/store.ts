import { RefObject, createRef } from 'react';

import { create } from 'zustand';

import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';
import { NODE_RANGE } from '@/constants';
import { isNodePoolNameValid } from '@/helpers/matchers/matchers';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { TScalingState } from '@/types';

type TStep = {
  isOpen: boolean;
  isLocked: boolean;
  isChecked: boolean;
  ref: RefObject<HTMLDivElement>;
};

export type TFormStore = {
  name: {
    value: string;
    isTouched: boolean;
    hasError: boolean;
  };
  flavor?: TComputedKubeFlavor;
  selectedAvailabilityZone: string | null;
  scaling: TScalingState;
  antiAffinity: boolean;
  isMonthlyBilling: boolean;
  steps: Map<StepsEnum, TStep>;
  set: {
    name: (val: string) => void;
    flavor: (val?: TComputedKubeFlavor) => void;
    selectedAvailabilityZone: (selectedZone: string) => void;
    scaling: (val: TScalingState) => void;
    antiAffinity: (val: boolean) => void;
    isMonthlyBilling: (val: boolean) => void;
  };
  open: (step: StepsEnum) => void;
  close: (step: StepsEnum) => void;

  lock: (step: StepsEnum) => void;
  unlock: (step: StepsEnum) => void;

  check: (step: StepsEnum) => void;
  uncheck: (step: StepsEnum) => void;

  edit: (step: StepsEnum) => void;

  reset: () => void;

  scrollToStep: (step: StepsEnum) => void;
};

const initialSteps = () =>
  new Map<StepsEnum, TStep>([
    [
      StepsEnum.NAME,
      {
        isOpen: true,
        isLocked: false,
        isChecked: false,
        ref: createRef(),
      },
    ],
    [
      StepsEnum.TYPE,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
        ref: createRef(),
      },
    ],
    [
      StepsEnum.SIZE,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
        ref: createRef(),
      },
    ],
    [
      StepsEnum.BILLING,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
        ref: createRef(),
      },
    ],
  ]);

const initScale = {
  quantity: { desired: NODE_RANGE.MIN, min: 0, max: NODE_RANGE.MAX },
  isAutoscale: false,
};

export const useNewPoolStore = create<TFormStore>()((set, get) => ({
  name: {
    value: '',
    hasError: false,
    isTouched: false,
  },
  flavor: undefined,
  scaling: initScale,
  antiAffinity: false,
  isMonthlyBilling: false,
  selectedAvailabilityZone: null,
  steps: initialSteps(),
  set: {
    selectedAvailabilityZone: (val: string) => {
      set({
        selectedAvailabilityZone: val,
      });
    },
    name: (val: string) => {
      if (val !== get().name.value) {
        set({
          name: {
            value: val,
            isTouched: true,
            hasError: !isNodePoolNameValid(val),
          },
        });
      }
    },

    flavor: (val?: TComputedKubeFlavor) => set({ flavor: val }),
    scaling: (val: TScalingState) => set({ scaling: val }),
    antiAffinity: (val: boolean) => set({ antiAffinity: val }),
    isMonthlyBilling: (val: boolean) => set({ isMonthlyBilling: val }),
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

    get().scrollToStep(id);
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
    // Activate
    get().open(id);
    get().uncheck(id);
    get().unlock(id);

    switch (id) {
      case StepsEnum.NAME:
        // Reset type
        get().set.flavor(undefined);

        get().close(StepsEnum.TYPE);
        get().uncheck(StepsEnum.TYPE);
        get().unlock(StepsEnum.TYPE);
        // Reset size
        get().set.scaling(initScale);

        get().close(StepsEnum.SIZE);
        get().uncheck(StepsEnum.SIZE);
        get().unlock(StepsEnum.SIZE);
        // Reset billing
        get().set.antiAffinity(false);
        get().set.isMonthlyBilling(false);

        get().close(StepsEnum.BILLING);
        get().uncheck(StepsEnum.BILLING);
        get().unlock(StepsEnum.BILLING);
        break;
      case StepsEnum.TYPE:
        // Reset size
        get().set.scaling(initScale);

        get().close(StepsEnum.SIZE);
        get().uncheck(StepsEnum.SIZE);
        get().unlock(StepsEnum.SIZE);
        // Reset billing
        get().set.antiAffinity(false);
        get().set.isMonthlyBilling(false);

        get().close(StepsEnum.BILLING);
        get().uncheck(StepsEnum.BILLING);
        get().unlock(StepsEnum.BILLING);
        break;
      case StepsEnum.SIZE:
        // Reset billing
        get().set.antiAffinity(false);
        get().set.isMonthlyBilling(false);

        get().close(StepsEnum.BILLING);
        get().uncheck(StepsEnum.BILLING);
        get().unlock(StepsEnum.BILLING);
        break;
      default:
    }
  },
  reset() {
    set(() => ({
      ...get(),
      name: { value: '', hasError: false, isTouched: false },
      flavor: undefined,
      scaling: initScale,
      antiAffinity: false,
      selectedAvailabilityZone: null,
      isMonthlyBilling: false,
      steps: initialSteps(),
    }));
  },
  scrollToStep: (id: StepsEnum) => {
    get().steps.get(id)?.ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  },
}));
