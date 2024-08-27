import { TLocalisation } from '@ovh-ux/manager-pci-common';
import { create } from 'zustand';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { StepEnum, TState, TStepperState } from '@/pages/create/types';
import { TCapability } from '@/api/data/capability';
import { PRIVATE_REGISTRY_CREATE_PLAN } from '@/pages/create/constants';
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
  stepper: TStepperState;
  act: {
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
    on: {
      success: () => void;
      error: (e: {
        response: { data: { message: any } };
        error: { message: any };
        message: any;
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
  act: {
    open: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isOpen: true },
        },
      }));
    },
    close: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isOpen: false },
        },
      }));
    },
    check: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isChecked: true },
        },
      }));
    },
    uncheck: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isChecked: false },
        },
      }));
    },
    lock: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isLocked: true },
        },
      }));
    },
    unlock: (step: StepEnum) => {
      set(() => ({
        stepper: {
          ...get().stepper,
          [step]: { ...get().stepper[step], isLocked: false },
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
    on: {
      success: () => void;
      error: (e: {
        response: { data: { message: any } };
        error: { message: any };
        message: any;
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
      on.success();
    } catch (e) {
      on.error(e);
    } finally {
      on.end();
    }
  },
}));
