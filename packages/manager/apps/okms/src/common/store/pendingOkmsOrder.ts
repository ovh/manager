import { create } from 'zustand';

type State = {
  hasPendingOrder: boolean;
  createdAt: string | null;
  region: string | null;
  initialOkmsIds: string[] | null;
};

const initialState: State = {
  hasPendingOrder: false,
  createdAt: null,
  region: null,
  initialOkmsIds: null,
};

const store = create<State>(() => ({
  ...initialState,
}));

export const usePendingOkmsOrderStore = store;

// ----- Actions ----- //

export const registerPendingOrder = (region: string) => {
  store.setState({
    hasPendingOrder: true,
    createdAt: new Date().toISOString(),
    region,
  });
};

export const saveInitialOkmsIds = (initialOkmsIds: string[]) => store.setState({ initialOkmsIds });

export const clearPendingOrder = () => {
  store.setState({
    ...initialState,
  });
};
