import { createContext, useContext } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

interface CommonContainerContextType {
  isS3StorageType: boolean;
  isRightOffer: boolean;
  isLocalZone: boolean;
  versioningStatus: string;
  shouldHideButton: boolean;
  hasStandardInfrequentAccess: boolean;
  handleAddObjectClick: () => void;
  trackClick: (params: TrackingClickParams) => void;
  trackAction: (
    actionType: 'page' | 'funnel',
    specificAction: string,
  ) => { actions: string[] };
}

interface S3ContainerContextType extends CommonContainerContextType {
  enableVersionsToggle: boolean;
  sortingDatagrid: ColumnSort | null;
  hasNextPage: boolean;
  isObjectsLoading: boolean;
  containerObjectsWithIndex: any[];
  containerObjects: any[];
  search: string | null;
  setEnableVersionsToggle: (value: boolean) => void;
  setSortingDatagrid: (sorting: ColumnSort | null) => void;
  setSearch: (value: string | null) => void;
  handleFetchNextPage: () => void;
  handlePrefixChange: (value: string | null) => void;
  objectsColumns: any[];
}

interface SwiftContainerContextType extends CommonContainerContextType {
  searchField: string;
  filters: any[];
  isPending: boolean;
  columns: any[];
  paginatedObjects: any;
  pagination: any;
  sorting: any;
  setSearchField: (value: string) => void;
  setPagination: (pagination: any) => void;
  setSorting: (sorting: any) => void;
  handleSearch: () => void;
  removeFilter: (filter: any) => void;
  addFilter: (filter: any) => void;
  filterColumns: any[];
}

// context used in both S3 and Swift containers datagrids
export const CommonContainerContext = createContext<
  CommonContainerContextType | undefined
>(undefined);
// context used only in S3 container datagrid
export const S3ContainerContext = createContext<
  S3ContainerContextType | undefined
>(undefined);
// context used only in Swift container datagrid
export const SwiftContainerContext = createContext<
  SwiftContainerContextType | undefined
>(undefined);

export const useCommonContainerContext = () => {
  const context = useContext(CommonContainerContext);
  if (!context) {
    throw new Error(
      'useCommonContainerContext must be used within a ContainerProvider',
    );
  }
  return context;
};

export const useS3ContainerContext = () => {
  return useContext(S3ContainerContext);
};

export const useSwiftContainerContext = () => {
  return useContext(SwiftContainerContext);
};

export const useSafeS3ContainerContext = () => {
  const context = useContext(S3ContainerContext);
  if (!context) {
    throw new Error(
      'useSafeS3ContainerContext must be used within a S3ContainerProvider',
    );
  }
  return context;
};

export const useSafeSwiftContainerContext = () => {
  const context = useContext(SwiftContainerContext);
  if (!context) {
    throw new Error(
      'useSafeSwiftContainerContext must be used within a SwiftContainerProvider',
    );
  }
  return context;
};
