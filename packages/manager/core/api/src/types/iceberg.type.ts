import { Filter } from './filters.type.js';

export declare enum IcebergCacheModeEnum {
  Cursor = 'cachedobjectlist-cursor',
  Pages = 'cachedobjectlist-pages',
}

export type IcebergCommonOptions = {
  route: string;
  pageSize?: number;
  disableCache?: boolean;
  search?: {
    key: string;
    value: string;
  };
};

export type IcebergFetchParamsV6 = {
  page?: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
} & IcebergCommonOptions;

export type IcebergFetchParamsV2 = {
  cursor?: string;
  filters?: Filter[];
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  icebergCacheMode?: IcebergCacheModeEnum;
  enableIcebergCache?: boolean;
} & IcebergCommonOptions;

export type IcebergFetchResultV6<T> = {
  data: T[];
  totalCount: number;
  status: number;
};

export type IcebergFetchResultV2<T> = {
  data: T[];
  cursorNext?: string;
  status: number;
};
