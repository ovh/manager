import { StateCreator } from 'zustand';

export type TRegionItem = {
  name: string;
  datacenter: string;
};

export type TForm = {
  modelName: string | null;
  region: TRegionItem | null;
};

export type TState = {
  form: TForm;
};

// Computed
export type TQuery = {
  modelName: () => string | null;
  region: () => TRegionItem | null;
};

// Handlers
export type TCommand = {
  setModelName: (newName: string) => void;
  setRegion: (newRegion: TRegionItem | null) => void;
};

export type TFormSlice = TState & TCommand & TQuery;

const intialForm: TForm = {
  modelName: null,
  region: null,
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
  setRegion: (newRegion) =>
    set((state) => ({
      form: { ...state.form, region: newRegion },
    })),
  modelName: () => get().form.modelName,
  region: () => get().form.region,
});
