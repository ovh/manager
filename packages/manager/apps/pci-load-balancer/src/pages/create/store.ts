import { create } from 'zustand';
import { TRegion } from '@/api/hook/usePlans';
import { TFloatingIp } from '@/api/data/region';
import { TPrivateNetwork, TSubnet } from '@/api/data/network';
import { ListenerConfiguration } from '@/components/create/InstanceTable.component';

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
  PUBLIC_IP = 'PUBLIC_IP',
  PRIVATE_NETWORK = 'PRIVATE_NETWORK',
  INSTANCE = 'INSTANCE',
}

export type TFormStore = {
  size: TPlan;
  region: TRegion;
  publicIp: TFloatingIp;
  privateNetwork: TPrivateNetwork;
  subnet: TSubnet;
  listeners: ListenerConfiguration[];
  steps: Map<StepsEnum, TStep>;
  set: {
    size: (val: TPlan) => void;
    region: (val: TRegion) => void;
    publicIp: (val: TFloatingIp) => void;
    privateNetwork: (val: TPrivateNetwork) => void;
    subnet: (val: TSubnet) => void;
    listeners: (val: ListenerConfiguration[]) => void;
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
    [
      StepsEnum.PUBLIC_IP,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      },
    ],
    [
      StepsEnum.PRIVATE_NETWORK,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      },
    ],
    [
      StepsEnum.INSTANCE,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      },
    ],
  ]);

export const useNewLoadBalancerStore = create<TFormStore>()((set, get) => ({
  size: null,
  region: null,
  publicIp: null,
  privateNetwork: null,
  subnet: null,
  listeners: [],
  steps: initialSteps(),
  set: {
    size: (val: TPlan) => {
      set({
        size: val,
      });
    },
    region: (val: TRegion) => {
      set({
        region: val,
      });
    },
    publicIp: (val: TFloatingIp) => {
      set({
        publicIp: val,
      });
    },
    privateNetwork: (val: TPrivateNetwork) => {
      set({
        privateNetwork: val,
      });
    },
    subnet: (val: TSubnet) => {
      set({
        subnet: val,
      });
    },
    listeners: (val: ListenerConfiguration[]) => {
      set({
        listeners: val,
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
