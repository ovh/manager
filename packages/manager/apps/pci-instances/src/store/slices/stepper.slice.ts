import { StateCreator } from 'zustand';

export type TStepId = 'model';

export type TStep = {
  isOpen: boolean;
  isChecked: boolean;
  isLocked: boolean;
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
  stepStateById: () => (stepId: TStepId) => TStep | undefined;
};

// Handlers
export type TCommand = {
  updateStep: (stepId: TStepId, step: Partial<TStep>) => void;
};

export type TStepperSlice = TQuery & TState & TCommand;

const initStep = (isOpen: boolean): TStep => ({
  isOpen,
  isChecked: false,
  isLocked: false,
});

const initialSteps = new Map<TStepId, TStep>([['model', initStep(true)]]);

export const createStepperSlice: StateCreator<
  TStepperSlice,
  [],
  [],
  TStepperSlice
> = (set, get) => ({
  steps: initialSteps,
  stepStateById: () => (stepId) => get().steps.get(stepId),
  updateStep: (stepId, step) =>
    set((state) => {
      const newSteps = new Map(state.steps);
      const activeStep = newSteps.get(stepId);
      if (activeStep) {
        const updatedSteps = newSteps.set(stepId, {
          ...activeStep,
          ...(step.isOpen !== undefined && { isOpen: step.isOpen }),
          ...(step.isChecked !== undefined && { isChecked: step.isChecked }),
          ...(step.isLocked !== undefined && { isLocked: step.isLocked }),
        });
        return { steps: updatedSteps };
      }
      return { steps: newSteps };
    }),
});
