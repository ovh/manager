import { create } from 'zustand';
import { OBJECT_CONTAINER_OFFER_STORAGE_STANDARD } from '@/constants';

export interface ContainerCreationForn {
  offer: string;
  deploymentMode: string;
}

export interface StepState {
  isOpen?: boolean;
  isChecked?: boolean;
  isLocked?: boolean;
}

export interface ContainerStore {
  form: ContainerCreationForn;
  stepper: {
    offer: StepState;
    deployment: StepState;
  };
  setOffer: (offer: string) => void;
  setDeploymentMode: (mode: string) => void;
  editOffer: () => void;
  submitOffer: () => void;
  editDeploymentMode: () => void;
  submitDeploymentMode: () => void;
}

export const useContainerCreationStore = create<ContainerStore>()((set) => {
  /** Unlock and open the 'toEdit' step, closes the other 'toClose' steps and reset their form values */
  const editStep = (toEdit: string, toClose: string[]) => {
    set((state) => ({
      stepper: {
        ...state.stepper,
        [toEdit]: {
          isOpen: true,
          isLocked: false,
          isChecked: false,
        },
        ...toClose.reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              isOpen: false,
              isLocked: false,
              isChecked: false,
            },
          }),
          {},
        ),
      },
      form: {
        ...state.form,
        ...toClose.reduce(
          (acc, key) => ({
            ...acc,
            [key]: undefined,
          }),
          {},
        ),
      },
    }));
  };

  /** Submit and close the 'toSubmit' step, open and unlock to next step */
  const submitStep = (toSubmit: string, nextState: string) => {
    set((state) => ({
      stepper: {
        ...state.stepper,
        [toSubmit]: {
          isOpen: false,
          isChecked: true,
          isLocked: true,
        },
        [nextState]: {
          isOpen: true,
          isChecked: false,
          isLocked: false,
        },
      },
    }));
  };

  return {
    // initial form state
    form: {
      offer: OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
      deploymentMode: undefined,
    },
    // initial stepper state
    stepper: {
      offer: { isOpen: true },
      deployment: {},
    },
    setOffer: (offer: string) =>
      set((state) => ({
        form: {
          ...state.form,
          offer,
          deploymentMode: undefined,
        },
      })),
    submitOffer: () => submitStep('offer', 'deployment'),
    editOffer: () => editStep('offer', ['deployment']),
    setDeploymentMode: (deploymentMode: string) =>
      set((state) => ({
        form: {
          ...state.form,
          deploymentMode,
        },
      })),
    submitDeploymentMode: () => submitStep('deployment', 'region'),
    editDeploymentMode: () => editStep('deployment', []),
  };
});
