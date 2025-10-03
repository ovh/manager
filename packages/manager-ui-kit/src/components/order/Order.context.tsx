import React, { createContext, useContext, useMemo, useState } from 'react';
import { TOrderContext } from './Order.type';

const OrderContext = createContext<TOrderContext>({} as TOrderContext);

export const OrderContextProvider = ({ children }: React.PropsWithChildren) => {
  const [isOrderInitialized, setIsOrderInitialized] = useState<boolean>(false);
  useState<boolean>(false);

  const context = useMemo<TOrderContext>(
    () => ({
      isOrderInitialized,
      setIsOrderInitialized,
    }),
    [isOrderInitialized],
  );

  return (
    <OrderContext.Provider value={context}>{children}</OrderContext.Provider>
  );
};

export const useOrderContext = (): TOrderContext => {
  const context = useContext(OrderContext);
  let error = false;
  if (context === undefined) error = true;
  return { ...context, error };
};
