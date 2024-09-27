import { StateCreator } from 'zustand';

export type TForm = {
  modelName: string | null;
};

export type TState = {
  form: TForm;
};

// Computed
export type TQuery = {
  modelName: () => string | null;
};

// Handlers
export type TCommand = {
  setModelName: (newName: string) => void;
};

export type TFormSlice = TState & TCommand & TQuery;

const intialForm: TForm = {
  modelName: null,
};

export const createFormSlice: StateCreator<TFormSlice, [], [], TFormSlice> = (
  set,
  get,
) => ({
  form: intialForm,
  setModelName: (newName) =>
    set((state) => ({
      form: { ...state.form, modelName: newName },
    })),
  modelName: () => get().form.modelName,
});
