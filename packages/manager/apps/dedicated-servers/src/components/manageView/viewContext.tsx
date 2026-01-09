import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';
import { DatagridColumn } from '@ovh-ux/muk';
import { VisibilityState } from '@tanstack/react-table';

export type ViewContextType<T> = {
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export const ViewContext = createContext<ViewContextType<VisibilityState>>({
  columnVisibility: {},
  setColumnVisibility: () => {},
});

export const ViewContextProvider = ({ children }: PropsWithChildren) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const viewContext = useMemo(
    () => ({
      columnVisibility,
      setColumnVisibility,
    }),
    [columnVisibility],
  );

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};
