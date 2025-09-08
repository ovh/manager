import { createContext, useContext, useRef } from 'react';
import {
  DatagridProviderProps,
  DatagridContextType,
} from './useDatagrid.props';

const DatagridContext = createContext<DatagridContextType | undefined>(
  undefined,
);

export const DatagridProvider = <T,>({
  children,
  data = [],
  columns = [],
  sorting,
  onSortChange,
  manualSorting,
}: DatagridProviderProps<T>) => {
  const headerRefs = useRef({});
  const contextValue: DatagridContextType<T> = {
    data,
    columns,
    headerRefs,
    sorting,
    onSortChange,
    manualSorting,
  };

  return (
    <DatagridContext.Provider value={contextValue}>
      {children}
    </DatagridContext.Provider>
  );
};

export const useDatagridContext = <T = any,>(): DatagridContextType<T> => {
  const context = useContext(DatagridContext);
  let isContextError = false;
  if (context === undefined) isContextError = true;
  return {
    ...(context as DatagridContextType<T>),
    isContextError,
  };
};
