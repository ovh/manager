import { create } from 'zustand';

export enum StepsEnum {
  'SIZE' = 'SIZE',
  'LOCATION' = 'LOCATION',
  NETWORK = 'NETWORK',
}

export type TStep = {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
};

type TStore = {
  project?: { id: string; isDiscovery: boolean };
  form: {
    name: string;
    size?: string;
    regionName: string;
    network: {
      id: string;
      subnetId: string;
    };
    newNetwork: {
      name: string;
      subnet: string;
    };
  };
  steps: Map<StepsEnum, TStep>;

  reset: () => void;

  setProject: (project: { id: string; isDiscovery: boolean }) => void;

  updateForm: {
    name: (name: string) => void;
    size: (size: string) => void;
    regionName: (regionName: string) => void;
    network: (id: string, subnetId: string) => void;
    newNetwork: (name: string, subnet: string) => void;
  };

  updateStep: {
    open: (id: StepsEnum) => void;
    close: (id: StepsEnum) => void;

    check: (id: StepsEnum) => void;
    unCheck: (id: StepsEnum) => void;

    lock: (id: StepsEnum) => void;
    unlock: (id: StepsEnum) => void;
  };
};

const getInitialSteps = () =>
  new Map([
    [
      StepsEnum.SIZE,
      {
        isOpen: true,
        isChecked: false,
        isLocked: false,
      },
    ],
    [
      StepsEnum.LOCATION,
      {
        isOpen: false,
        isChecked: false,
        isLocked: false,
      },
    ],
    [
      StepsEnum.NETWORK,
      {
        isOpen: false,
        isChecked: false,
        isLocked: false,
      },
    ],
  ]);

const initialState = {
  project: undefined,
  form: {
    name: undefined,
    size: undefined,
    regionName: undefined,
    network: {
      id: undefined,
      subnetId: undefined,
    },
    newNetwork: {
      name: undefined,
      subnet: undefined,
    },
  },
  steps: getInitialSteps(),
};

export const useNewGatewayStore = create<TStore>()((set) => ({
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
  updateForm: {
    name: (name: string) => {
      set((state) => ({
        form: {
          ...state.form,
          name,
        },
      }));
    },
    size: (size: string) => {
      set((state) => ({
        form: {
          ...state.form,
          size,
        },
      }));
    },
    regionName: (regionName: string) => {
      set((state) => ({
        form: {
          ...state.form,
          regionName,
        },
      }));
    },
    network: (id: string, subnetId: string) => {
      set((state) => ({
        form: {
          ...state.form,
          network: {
            id,
            subnetId,
          },
        },
      }));
    },
    newNetwork: (name: string, subnet: string) => {
      set((state) => ({
        form: {
          ...state.form,
          newNetwork: {
            name,
            subnet,
          },
        },
      }));
    },
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
}));
