import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
} from 'react';
import { IamResource } from '@/data/api/iam-resources';

export type ResourcesDatagridContextType = {
  setSelectedResourcesList: (resource: IamResource[]) => void;
  selectedResourcesList: IamResource[];
};

export const ResourcesDatagridContext = createContext<ResourcesDatagridContextType | null>(
  null,
);

export const ResourcesDatagridContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedResourcesList, setSelectedResourcesList] = useState<
    IamResource[]
  >([]);

  const resourcesDatagridContext = useMemo(
    () => ({
      selectedResourcesList,
      setSelectedResourcesList,
    }),
    [JSON.stringify(selectedResourcesList)],
  );

  return (
    <ResourcesDatagridContext.Provider value={resourcesDatagridContext}>
      {children}
    </ResourcesDatagridContext.Provider>
  );
};
