import { TLocalisation } from '@ovh-ux/manager-pci-common';
import { create } from 'zustand';
import { StepEnum, TState, TStepsState } from '@/pages/create/types';
import { TCapability } from '@/api/data/capability';
import { createRegistry } from '@/api/data/registry';

type TStore = {
  state: TState;
  set: {
    name: {
      value: (val: string) => void;
      touched: (val: boolean) => void;
    };
    region: (val: TLocalisation) => void;
    plan: (val: TCapability['plans'][0]) => void;
  };
  stepsState: TStepsState;
  stepsHandle: {
    open: (step: StepEnum) => void;
    close: (step: StepEnum) => void;
    check: (step: StepEnum) => void;
    uncheck: (step: StepEnum) => void;
    lock: (step: StepEnum) => void;
    unlock: (step: StepEnum) => void;
  };
  reset: () => void;
  create: (
    projectId: string,
    callbacks: {
      success: () => void;
      error: (e: {
        response: { data: { message: never } };
        error: { message: never };
        message: never;
      }) => void;
      end: () => void;
    },
  ) => Promise<void>;
};

export const useStore = create<TStore>((set, get) => ({
  state: {
    name: {
      value: '',
      touched: false,
    },
    region: null,
    plan: undefined,
  },
  set: {
    name: {
      value(val: string) {
        set(() => ({
          state: {
            ...get().state,
            name: {
              value: val,
              touched: get().state.name.touched,
            },
          },
        }));
      },
      touched(val: boolean) {
        set(() => ({
          state: {
            ...get().state,
            name: {
              value: get().state.name.value,
              touched: val,
            },
          },
        }));
      },
    },
    region(val: TLocalisation) {
      set(() => ({
        state: {
          ...get().state,
          region: val,
        },
      }));
    },
    plan(val: TCapability['plans'][0]) {
      set(() => ({
        state: {
          ...get().state,
          plan: val,
        },
      }));
    },
  },
  stepsState: {
    [StepEnum.REGION]: {
      isOpen: true,
      isLocked: false,
      isChecked: false,
    },
    [StepEnum.NAME]: {
      isOpen: false,
      isLocked: false,
      isChecked: false,
    },
    [StepEnum.PLAN]: {
      isOpen: false,
      isLocked: false,
      isChecked: false,
    },
  },
  stepsHandle: {
    open: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isOpen: true },
        },
      }));
    },
    close: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isOpen: false },
        },
      }));
    },
    check: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isChecked: true },
        },
      }));
    },
    uncheck: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isChecked: false },
        },
      }));
    },
    lock: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isLocked: true },
        },
      }));
    },
    unlock: (step: StepEnum) => {
      set(() => ({
        stepsState: {
          ...get().stepsState,
          [step]: { ...get().stepsState[step], isLocked: false },
        },
      }));
    },
  },
  reset: () => {
    set(() => ({
      state: {
        name: {
          value: '',
          touched: false,
        },
        region: null,
        plan: undefined,
      },
      stepper: {
        [StepEnum.REGION]: {
          isOpen: true,
          isLocked: false,
          isChecked: false,
        },
        [StepEnum.NAME]: {
          isOpen: false,
          isLocked: false,
          isChecked: false,
        },
        [StepEnum.PLAN]: {
          isOpen: false,
          isLocked: false,
          isChecked: false,
        },
      },
    }));
  },
  create: async (
    projectId: string,
    callbacks: {
      success: () => void;
      error: (e: {
        response: { data: { message: never } };
        error: { message: never };
        message: never;
      }) => void;
      end: () => void;
    },
  ) => {
    const payload = {
      name: get().state.name.value,
      region: get().state.region.name,
      planID: get().state.plan.id,
    };

    try {
      await createRegistry(projectId, payload);
      callbacks.success();
    } catch (e) {
      callbacks.error(e);
    } finally {
      callbacks.end();
    }
  },
}));
