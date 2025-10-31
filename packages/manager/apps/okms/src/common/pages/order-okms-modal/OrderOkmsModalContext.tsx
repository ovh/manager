import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from 'react';

// custom type for the state
export type OrderOkmsModalContextState = {
  orderProcessingRegion: string | undefined;
  setOrderProcessingRegion: (region: string | undefined) => void;
  resetOrderProcessingRegion: () => void;
};

const OrderOkmsModalContext = createContext<
  OrderOkmsModalContextState | undefined
>(undefined);

export const OrderOkmsModalProvider = ({
  children,
  region,
}: PropsWithChildren<{ region?: string }>) => {
  const [orderProcessingRegion, setOrderProcessingRegion] = useState(region);

  const value = {
    orderProcessingRegion,
    setOrderProcessingRegion,
    resetOrderProcessingRegion: () => setOrderProcessingRegion(undefined),
  };

  return (
    <OrderOkmsModalContext.Provider value={value}>
      {children}
    </OrderOkmsModalContext.Provider>
  );
};

export const useOrderOkmsModalContext = () => {
  return useContext(OrderOkmsModalContext);
};
