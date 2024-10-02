import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react';

type DatacentreOrderContextType = {
  selectedResource: string;
  setSelectedResource: Dispatch<SetStateAction<string>>;
  selectedQuantity: number;
  setSelectedQuantity: Dispatch<SetStateAction<number>>;
};

type DatacentreOrderProviderProps = {
  children: ReactNode;
};

const DatacentreOrderContext = createContext<
  DatacentreOrderContextType | undefined
>(undefined);

export const DatacentreOrderProvider: React.FC<DatacentreOrderProviderProps> = ({
  children,
}) => {
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const contextValue = useMemo(
    () => ({
      selectedResource,
      setSelectedResource,
      selectedQuantity,
      setSelectedQuantity,
    }),
    [selectedResource, selectedQuantity],
  );

  return (
    <DatacentreOrderContext.Provider value={contextValue}>
      {children}
    </DatacentreOrderContext.Provider>
  );
};

export const useDatacentreOrderContext = (): DatacentreOrderContextType => {
  const context = useContext(DatacentreOrderContext);
  if (context === undefined) {
    throw new Error(
      'useDatacentreOrderContext must be used within a DatacentreOrderProvider',
    );
  }
  return context;
};
