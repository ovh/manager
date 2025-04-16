import { create } from 'zustand';
import { TFlavor } from '@ovh-ux/manager-pci-common';
import { createRef, MutableRefObject } from 'react';
import { StepsEnum } from '@/pages/detail/nodepools/new/steps.enum';
import { AutoscalingState } from '@/components/Autoscaling.component';
import { NAME_INPUT_CONSTRAINTS } from '@/constants';

type TStep = {
  isOpen: boolean;
  isLocked: boolean;
  isChecked: boolean;
  ref: MutableRefObject<HTMLDivElement>;
};

export type TFormStore = {
  name: {
    value: string;
    isTouched: boolean;
    hasError: boolean;
  };
  flavor: TFlavor;
  selectedAvailibilityZone: string;
  autoScaling: AutoscalingState;
  antiAffinity: boolean;
  isMonthlyBilling: boolean;
  steps: Map<StepsEnum, TStep>;
  set: {
    name: (val: string) => void;
    flavor: (val: TFlavor) => void;
    selectedAvailibilityZone: (selectedZone: string) => void;
    autoScaling: (val: AutoscalingState) => void;
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

export const useNewPoolStore = create<TFormStore>()((set, get) => ({
  name: {
    value: '',
    hasError: false,
    isTouched: false,
  },
  flavor: undefined,
  autoScaling: null,
  antiAffinity: false,
  isMonthlyBilling: false,
  selectedAvailibilityZone: '',
  steps: initialSteps(),
  set: {
    selectedAvailibilityZone: (val: string) => {
      set({
        selectedAvailibilityZone: val,
      });
    },
    name: (val: string) => {
      if (val !== get().name.value) {
        set({
          name: {
            value: val,
            isTouched: true,
            hasError:
              val.length > NAME_INPUT_CONSTRAINTS.MAX_LENGTH ||
              !NAME_INPUT_CONSTRAINTS.PATTERN.exec(val),
          },
        });
      }
    },

    flavor: (val: TFlavor) => set({ flavor: val }),
    autoScaling: (val: AutoscalingState) => set({ autoScaling: val }),
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
        get().set.autoScaling(null);

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
        get().set.autoScaling(null);

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
      autoScaling: null,
      antiAffinity: false,
      isMonthlyBilling: false,
      steps: initialSteps(),
    }));
  },
  scrollToStep: (id: StepsEnum) => {
    get()
      .steps.get(id)
      .ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  },
}));
