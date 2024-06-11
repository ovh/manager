import { create } from 'zustand';
import { DEFAULT_CIDR, DEFAULT_IP, DEFAULT_VLAN_ID } from '@/constants';
import { TMappedRegion } from '@/pages/new/steps/LocalizationStep';
import { TGateway } from '@/api/data/regions';
import {
  associateGatewayToNetworkCall,
  createNetwork,
  enableSnatOnGatewayCall,
} from '@/api/data/network';
import queryClient from '@/queryClient';

export enum StepsEnum {
  CONFIGURATION = 'CONFIGURATION',
  LOCALIZATION = 'LOCALIZATION',
  SUMMARY = 'SUMMARY',
}

export type TStep = {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
};

export const DEFAULT_FORM_STATE = {
  privateNetworkName: '',
  region: undefined,
  createGateway: false,
  gateway: undefined,
  gatewayName: undefined,
  gatewaySize: undefined,
  configureVlanId: false,
  vlanId: DEFAULT_VLAN_ID,
  dhcp: true,
  enableGatewayIp: true,
  address: DEFAULT_IP.replace('{vlanId}', `${DEFAULT_VLAN_ID}`),
  cidr: DEFAULT_CIDR,
  enableSNAT: false,
  isCreating: false,
};

const getInitialSteps = () =>
  new Map([
    [
      StepsEnum.LOCALIZATION,
      {
        isOpen: true,
        isChecked: false,
        isLocked: false,
      },
    ],
    [
      StepsEnum.CONFIGURATION,
      {
        isOpen: false,
        isChecked: false,
        isLocked: false,
      },
    ],
    [
      StepsEnum.SUMMARY,
      {
        isOpen: false,
        isChecked: false,
        isLocked: false,
      },
    ],
  ]);

const initialState = {
  project: { id: undefined, isDiscovery: undefined },
  form: DEFAULT_FORM_STATE,
  steps: getInitialSteps(),
};

type TStore = {
  project?: { id: string; isDiscovery: boolean };
  form: {
    privateNetworkName: string;
    region: TMappedRegion;
    createGateway: boolean;
    gateway?: TGateway;
    gatewayName?: string;
    gatewaySize?: string;
    configureVlanId: boolean;
    vlanId: number;
    dhcp: boolean;
    enableGatewayIp: boolean;
    address: string;
    cidr: number;
    enableSNAT: boolean;
    isCreating: boolean;
  };
  steps: Map<StepsEnum, TStep>;

  reset: () => void;

  setProject: (project: { id: string; isDiscovery: boolean }) => void;

  setForm: (newForm: Partial<TStore['form']>) => void;

  updateStep: {
    open: (id: StepsEnum) => void;
    close: (id: StepsEnum) => void;

    check: (id: StepsEnum) => void;
    unCheck: (id: StepsEnum) => void;

    lock: (id: StepsEnum) => void;
    unlock: (id: StepsEnum) => void;
  };

  create: () => Promise<void>;
};

export const useNewNetworkStore = create<TStore>()((set, get) => ({
  ...initialState,
  reset: () =>
    set({
      ...initialState,
      steps: getInitialSteps(),
    }),
  setProject: (project: { id: string; isDiscovery: boolean }) => {
    set(() => ({
      project,
    }));
  },
  setForm: (newForm: Partial<TStore['form']>) => {
    set((state) => ({
      form: {
        ...state.form,
        ...newForm,
      },
    }));
  },
  updateStep: {
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
    unCheck: (id: StepsEnum) => {
      set((state) => {
        const steps = new Map(state.steps);
        steps.get(id).isChecked = false;
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
  },
  create: async () => {
    const subnetResponse = await createNetwork({
      projectId: get().project?.id,
      region: get().form.region.code,
      privateNetworkName: get().form.privateNetworkName,
      subnet: {
        cidr: `${get().form.address}/${get().form.cidr}`,
        ipVersion: 4,
        enableDhcp: get().form.dhcp,
        enableGatewayIp: get().form.enableGatewayIp,
      },
      vlanId:
        get().form.configureVlanId && !get().form.region?.isLocalZone
          ? get().form.vlanId
          : undefined,
      gateway:
        get().form.createGateway && !get().form.gateway
          ? {
              gatewayName: get().form.gatewayName,
              gatewaySize: get().form.gatewaySize,
            }
          : undefined,
    });

    // enable snats
    if (
      get().form.createGateway &&
      get().form.gateway &&
      !get().form.gateway.externalInformation &&
      get().form.enableSNAT
    ) {
      await enableSnatOnGatewayCall(
        get().project?.id,
        get().form.region.code,
        get().form.gateway.id,
      );
    }

    // associate
    if (get().form.createGateway && get().form.gateway) {
      await associateGatewayToNetworkCall(
        get().project?.id,
        get().form.region?.code,
        get().form.gateway.id,
        subnetResponse[0].id,
      );
    }

    await queryClient.invalidateQueries({
      queryKey: ['aggregated-network', get().project?.id],
    });
  },
}));
