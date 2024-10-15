import { StateCreator } from 'zustand';

export type TStepId = 'model' | 'region';

export type TStepState = {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
};

export type TStep = TStepState & {
  order: number;
};

export type TSteps = Map<TStepId, TStep>;

export type TState = {
  steps: TSteps;
};

/**
 * By default, computed functions in Zustand do not return updated values.
 * If used with a parameter, currification enables reactivity for getters.
 */
export type TQuery = {
  stepById: () => (stepId: TStepId) => TStep | undefined;
};

// Handlers
export type TCommand = {
  editStep: (stepId: TStepId) => void;
  validateStep: (stepId: TStepId) => void;
};

export type TStepperSlice = TQuery & TState & TCommand;

const inactiveStepState: TStepState = {
  isOpen: false,
  isChecked: false,
  isLocked: false,
};

const editStepState: TStepState = {
  ...inactiveStepState,
  isOpen: true,
};

const validateStepState: TStepState = {
  ...inactiveStepState,
  isChecked: true,
  isLocked: true,
};

const initialSteps = new Map<TStepId, TStep>([
  ['model', { ...editStepState, order: 1 }],
  ['region', { ...inactiveStepState, order: 2 }],
]);

export const createStepperSlice: StateCreator<
  TStepperSlice,
  [],
  [],
  TStepperSlice
> = (set, get) => ({
  steps: initialSteps,
  stepById: () => (stepId) => get().steps.get(stepId),
  editStep: (stepId) =>
    set((state) => {
      const newSteps = new Map<TStepId, TStep>();
      const activeStep = state.steps.get(stepId);
      if (activeStep) {
        state.steps.forEach((value, key) => {
          if (key === stepId) {
            newSteps.set(stepId, {
              ...activeStep,
              ...editStepState,
            });
          } else if (value.order > activeStep.order) {
            newSteps.set(key, {
              ...value,
              ...inactiveStepState,
            });
          } else {
            newSteps.set(key, { ...value, isOpen: false });
          }
        });
      }
      return { steps: newSteps };
    }),
  validateStep: (stepId) =>
    set((state) => {
      const newSteps = new Map(state.steps);
      const activeStep = newSteps.get(stepId);

      if (activeStep) {
        const nextStep = [...newSteps].find(
          (elt) => elt[1].order === activeStep.order + 1,
        );
        newSteps.set(stepId, {
          ...activeStep,
          ...validateStepState,
        });
        if (nextStep) {
          const [key, value] = nextStep;
          newSteps.set(key, {
            ...value,
            ...editStepState,
          });
        }
      }
      return { steps: newSteps };
    }),
});
