import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';
import { DatagridColumn } from '@ovh-ux/muk';
import { VisibilityState } from '@tanstack/react-table';
import { useColumns } from '../dataGridColumns';
import { DedicatedServer } from '@/data/types/server.type';

export type ColumnsConfig<T> = DatagridColumn<T> & {
  visible?: boolean;
};

export type ViewContextType<T> = {
  columnsConfig: ColumnsConfig<T>[];
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export const ViewContext = createContext<ViewContextType<DedicatedServer>>({
  columnsConfig: [],
  columnVisibility: {},
  setColumnVisibility: () => {},
});

export const ViewContextProvider = ({ children }: PropsWithChildren) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    serverId: false,
    'iam.displayName': true,
    ip: true,
    reverse: false,
    commercialRange: true,
    os: false,
    region: true,
    rack: false,
    datacenter: false,
    state: true,
    monitoring: false,
    vrack: false,
    renew: false,
    expiration: false,
    engagement: false,
    price: false,
    tags: true,
    actions: true,
  });
  const columns = useColumns();

  const viewContext = useMemo(() => {
    const columnsConfig = columns.map((column) => {
      return {
        ...column,
        visible: columnVisibility[column.id],
      };
    });

    return {
      columnsConfig,
      columnVisibility,
      setColumnVisibility,
    };
  }, [columnVisibility]);

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};
