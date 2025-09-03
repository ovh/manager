import React, {
  useMemo,
  useState,
  PropsWithChildren,
  createContext,
  useContext,
} from 'react';
import { IamResource } from '@/data/api/iam-resources';
import { ResourcesDatagridFilter } from '../resourcesDatagridTopbar/ResourcesDatagridTopbar.component';

export type ResourcesDatagridContextType = {
  setSelectedResourcesList: (resource: IamResource[]) => void;
  selectedResourcesList: IamResource[];
  filters: ResourcesDatagridFilter[];
  addFilter: (filter: ResourcesDatagridFilter) => void;
  removeFilter: (filter: ResourcesDatagridFilter) => void;
  setFilters: (filters: ResourcesDatagridFilter[]) => void;
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

  const [filters, setFilters] = useState<ResourcesDatagridFilter[]>([]);

  const resourcesDatagridContext = useMemo(
    () => ({
      selectedResourcesList,
      setSelectedResourcesList,
      filters,
      addFilter: (filter: ResourcesDatagridFilter) => {
        if (filters.find((filterInArray) => filterInArray.id === filter.id))
          return;
        setFilters([...filters, filter]);
      },
      removeFilter: (filterToRemove: ResourcesDatagridFilter) => {
        const newFilters = [...filters];
        newFilters.splice(
          filters.findIndex(
            (filterInArray) => filterInArray.id === filterToRemove.id,
          ),
          1,
        );
        setFilters(newFilters);
      },
      setFilters,
    }),
    [selectedResourcesList, filters],
  );

  return (
    <ResourcesDatagridContext.Provider value={resourcesDatagridContext}>
      {children}
    </ResourcesDatagridContext.Provider>
  );
};
