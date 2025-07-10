import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useContext,
} from 'react';
import { IamResource } from '@/data/api/iam-resources';

export type ResourcesDatagridContextType = {
  setSelectedResourcesList: (resource: IamResource[]) => void;
  selectedResourcesList: IamResource[];
};

const ResourcesDatagridContext = createContext<ResourcesDatagridContextType | null>(
  null,
);

export const useResourcesDatagridContext = (): ResourcesDatagridContextType => {
  const context = useContext(ResourcesDatagridContext);
  if (!context) {
    throw new Error(
      'useResourcesDatagridContext must be used within a <ResourcesDatagridContextProvider>',
    );
  }
  return context;
};

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
