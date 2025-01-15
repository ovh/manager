export interface UseResourcesIcebergType {
  flattenData: TOngoingOperations;
  isError: boolean;
  error: Error | null;
  totalCount: number;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
  isLoading: boolean;
  sorting: { field: string; order: 'asc' | 'desc' };
  setSorting: (field: string) => void;
  pageIndex: number;
}

export interface TOngoingOperations {
  id: number;
  domain: string;
  zone: string;
  function: string;
  comment: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  endDate: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TArgumentData {
  data: TArgument;
}

export interface TArgument {
  acceptedFormats: null;
  acceptedValues: null;
  description: string;
  fields: string[];
  key: string;
  maximumSize: string;
  minimumSize: string;
  readOnly: boolean;
  template: string;
  type: string;
  value: string;
}
