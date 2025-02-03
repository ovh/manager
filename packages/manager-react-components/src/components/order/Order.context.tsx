import React, { createContext, useContext, useMemo, useState } from 'react';

export type TOrderContext = {
  setIsOrderInitialized: (isOrderInitialized: boolean) => void;
  isOrderInitialized: boolean;
};

const OrderContext = createContext<TOrderContext>({} as TOrderContext);

export const OrderContextProvider = ({ children }: React.PropsWithChildren) => {
  const [isOrderInitialized, setIsOrderInitialized] = useState<boolean>(false);

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
  if (context === undefined) {
    throw new Error('Order-related components must be used within <Order>');
  }
  return context;
};
