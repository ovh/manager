import { createContext, useContext } from 'react';

export type HubLayoutContext = {
  isLoading?: boolean;
  isFreshCustomer?: boolean;
  availability?: Record<string, boolean>;
};

export const Context = createContext<HubLayoutContext>({});

export const useHubContext = (): HubLayoutContext => useContext(Context);
