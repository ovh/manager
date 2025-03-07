import { create } from 'zustand';
import { TUser } from '@/api/data/users';

export interface ContainerCreationForm {
  ownerId: number;
  containerName: string;
  selectedUser?: TUser;
}

export interface StepState {
  isOpen?: boolean;
  isChecked?: boolean;
  isLocked?: boolean;
}

export interface ContainerStore {
  form: ContainerCreationForm;
  stepper: {
    ownerId: StepState;
    containerName: StepState;
  };
  reset: () => void;
  setOwnerId: (ownerId: number) => void;
  editOwnerId: () => void;
  submitOwnerId: () => void;
  setContainerName: (name: string) => void;
  setSelectedUser: (user: TUser) => void;
}

const initialForm = {
  ownerId: undefined,
  containerName: '',
  selectedUser: undefined,
};

const initialStepper = {
  ownerId: { isOpen: true, isChecked: false, isLocked: false },
  containerName: { isOpen: false, isChecked: false, isLocked: false },
};

export const useContainerCreationStore = create<ContainerStore>()((set) => {
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
    form: initialForm,
    stepper: initialStepper,
    reset: () =>
      set((state) => ({
        ...state,
        form: initialForm,
        stepper: initialStepper,
      })),

    setOwnerId: (ownerId: number) =>
      set((state) => ({
        form: {
          ...state.form,
          ownerId,
          containerName: '',
        },
      })),
    editOwnerId: () => editStep('ownerId', ['containerName']),
    submitOwnerId: () => submitStep('ownerId', 'containerName'),

    setContainerName: (containerName: string) =>
      set((state) => ({
        form: {
          ...state.form,
          containerName,
        },
      })),

    setSelectedUser: (user: TUser) =>
      set((state) => ({
        form: {
          ...state.form,
          selectedUser: user,
        },
      })),
  };
});
