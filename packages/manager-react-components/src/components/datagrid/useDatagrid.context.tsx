import { createContext, useContext, useState, ReactNode } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  DatagridProviderProps,
  DatagridContextType,
} from './useDatagrid.props';

const DatagridContext = createContext<DatagridContextType | undefined>(
  undefined,
);

export const DatagridProvider = <T,>({
  children,
  initialData = [],
  initialColumns = [],
}: DatagridProviderProps<T>) => {
  const [data, setData] = useState<T[]>(initialData);
  const [columns, setColumns] = useState<ColumnDef<T>[]>(initialColumns);

  const contextValue: DatagridContextType<T> = {
    data,
    columns,
    setData,
    setColumns,
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
