import type { SortingState } from '@tanstack/react-table';

export type UseResourcesParams<T> = {
  route: string;
  queryKey?: unknown[];
  pageSize?: number;
  columns?: string[];
  defaultSorting?: SortingState;
  enabled?: boolean;
  disableCache?: boolean;
  fetchAll?: boolean;
  refetchInterval?: number;
  fetchDataFn?: () => Promise<T[]>;
};

export type ResourcesFacadeResult<T> = {
  flattenData?: T[];
  totalCount?: number;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isLoading?: boolean;
  status?: 'pending' | 'success' | 'error';
  sorting?: SortingState[0];
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
  filters?: unknown;
  search?: unknown;
};
