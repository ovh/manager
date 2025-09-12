import { Filter } from './filters.type.js';

export type IcebergCommonOptions = {
  route: string;
  pageSize?: number;
  disableCache?: boolean;
  search?: {
    key: string;
    value: string;
  };
};

export type IcebergFetchParams = {
  version: 'v6' | 'v2';
  page?: number;
  filters?: Filter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
} & IcebergCommonOptions;

export type IcebergFetchResult<TData> = {
  data: TData;
  totalCount: number;
  status: number;
};

// @deprecated Use IcebergFetchParams
export type IcebergFetchParamsV6 = {
  page?: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
} & IcebergCommonOptions;

// @deprecated Use IcebergFetchParams
export type IcebergFetchParamsV2 = {
  cursor?: string;
  filters?: Filter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
} & IcebergCommonOptions;

// @deprecated Use IcebergFetchResult
export type IcebergFetchResultV6<T> = {
  data: T[];
  totalCount: number;
  status: number;
};

// @deprecated Use IcebergFetchResult
export type IcebergFetchResultV2<T> = {
  data: T[];
  cursorNext?: string;
  status: number;
};
