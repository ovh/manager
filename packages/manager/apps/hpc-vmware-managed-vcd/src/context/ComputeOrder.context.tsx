import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

type ComputeOrderContextType = {
  selectedVhost: string;
  setSelectedVhost: Dispatch<SetStateAction<string>>;
  selectedQuantity: number;
  setSelectedQuantity: Dispatch<SetStateAction<number>>;
};

type ComputeOrderProviderProps = {
  children: ReactNode;
};

const ComputeOrderContext = createContext<ComputeOrderContextType | undefined>(
  undefined,
);

export const ComputeOrderProvider: React.FC<ComputeOrderProviderProps> = ({
  children,
}) => {
  const [selectedVhost, setSelectedVhost] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const contextValue = useMemo(
    () => ({
      selectedVhost,
      setSelectedVhost,
      selectedQuantity,
      setSelectedQuantity,
    }),
    [selectedVhost, selectedQuantity],
  );

  return (
    <ComputeOrderContext.Provider value={contextValue}>
      {children}
    </ComputeOrderContext.Provider>
  );
};

export const useComputeOrderContext = (): ComputeOrderContextType => {
  const context = useContext(ComputeOrderContext);
  if (context === undefined) {
    throw new Error(
      'useComputeOrderContext must be used within a ComputeOrderProvider',
    );
  }
  return context;
};
