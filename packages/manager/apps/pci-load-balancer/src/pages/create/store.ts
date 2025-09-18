import { create } from 'zustand';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-pci-common';
import { TPrivateNetwork, TSubnet } from '@/api/data/network';
import { TSubnetGateway } from '@/api/data/gateways';
import { createLoadBalancer, TFlavor } from '@/api/data/load-balancer';
import { TProductAddonDetail } from '@/types/product.type';
import { FloatingIpSelectionId } from '@/types/floating.type';
import { ListenerConfiguration } from '@/types/listener.type';

type TStep = {
  isOpen: boolean;
  isLocked: boolean;
  isChecked: boolean;
};

export enum StepsEnum {
  REGION = 'REGION',
  SIZE = 'SIZE',
  IP = 'IP',
  NETWORK = 'NETWORK',
  INSTANCE = 'INSTANCE',
  NAME = 'NAME',
}

export type TCreateStore = {
  projectId: string;
  addon: TProductAddonDetail | null;
  region: TRegion | null;
  publicIp: string | FloatingIpSelectionId | null;
  privateNetwork: TPrivateNetwork | null;
  subnet: TSubnet | null;
  gateways: TSubnetGateway[];
  listeners: ListenerConfiguration[];
  name: string;
  steps: Map<StepsEnum, TStep>;
  set: {
    projectId: (val: string) => void;
    addon: (val: TProductAddonDetail) => void;
    region: (val: TRegion) => void;
    publicIp: (val: string) => void;
    privateNetwork: (val: TPrivateNetwork) => void;
    subnet: (val: TSubnet) => void;
    gateways: (val: TSubnetGateway[]) => void;
    listeners: (val: ListenerConfiguration[]) => void;
    name: (val: string) => void;
  };
  open: (step: StepsEnum) => void;
  close: (step: StepsEnum) => void;

  lock: (step: StepsEnum) => void;
  unlock: (step: StepsEnum) => void;

  check: (step: StepsEnum) => void;
  uncheck: (step: StepsEnum) => void;

  reset: (...param: StepsEnum[]) => void;

  create: (
    flavor: TFlavor,
    onSuccess: () => void,
    onError: (cause: ApiError) => void,
  ) => Promise<void>;
};

export const initialStoreState = () => ({
  projectId: '',
  addon: null,
  region: null,
  publicIp: null,
  privateNetwork: null,
  subnet: null,
  gateways: [],
  listeners: [],
  name: '',
  steps: new Map<StepsEnum, TStep>([
    [
      StepsEnum.REGION,
      {
        isOpen: true,
        isLocked: false,
        isChecked: false,
      },
    ],
    ...[
      StepsEnum.SIZE,
      StepsEnum.IP,
      StepsEnum.NETWORK,
      StepsEnum.INSTANCE,
      StepsEnum.NAME,
    ].map((step: StepsEnum) => [
      step,
      {
        isOpen: false,
        isLocked: false,
        isChecked: false,
      } as TStep,
    ]),
  ] as [[StepsEnum, TStep]]),
});

export const useCreateStore = create<TCreateStore>()((set, get) => ({
  ...initialStoreState(),
  set: {
    projectId: (val: string) => {
      set({
        projectId: val,
      });
    },
    addon: (val: TProductAddonDetail) => {
      set({
        addon: val,
      });
    },
    region: (val: TRegion) => {
      set({
        region: val,
      });
    },
    publicIp: (val: string) => {
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
    gateways: (val: TSubnetGateway[]) => {
      set({
        gateways: val,
      });
    },
    listeners: (val: ListenerConfiguration[]) => {
      set({
        listeners: val,
      });
    },
    name: (val: string) => {
      set({
        name: val,
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
  reset(...steps: StepsEnum[]) {
    if (!steps.length) {
      set(() => ({
        ...get(),
        ...initialStoreState(),
      }));
    } else {
      steps.forEach((step) => {
        get().close(step);
        get().unlock(step);
        get().uncheck(step);
        switch (step) {
          case StepsEnum.SIZE:
            get().set.addon(null);
            break;
          case StepsEnum.REGION:
            get().set.region(null);
            break;
          case StepsEnum.IP:
            get().set.publicIp(null);
            break;
          case StepsEnum.NETWORK:
            get().set.privateNetwork(null);
            get().set.subnet(null);
            get().set.gateways([]);
            break;
          case StepsEnum.INSTANCE:
            get().set.listeners([]);
            break;
          case StepsEnum.NAME:
            get().set.name('');
            break;
          default:
        }
      });
    }
  },
  create: async (flavor: TFlavor, onSuccess, onError) => {
    try {
      await createLoadBalancer({
        projectId: get().projectId,
        flavor,
        region: get().region,
        floatingIp: get().publicIp,
        privateNetwork: get().privateNetwork,
        subnet: get().subnet,
        gateways: get().gateways,
        listeners: get().listeners,
        name: get().name,
      });
      onSuccess();
    } catch (e) {
      onError(e);
    }
  },
}));
