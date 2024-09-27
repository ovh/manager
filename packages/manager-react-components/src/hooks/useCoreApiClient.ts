import { useContext } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { ManagerReactComponentContext } from '../context/ManagerReactContext';

export type ApiResponse<T> = AxiosResponse<T>;
export type ApiError = AxiosError<{ message: string }>;

export type IcebergCommonOptions = {
  route: string;
  pageSize?: number;
  search?: {
    key: string;
    value: string;
  };
};

export type IcebergFetchResultV2<T> = {
  data: T[];
  cursorNext: string;
  status: number;
};

export type IcebergFetchResultV6<T> = {
  data: T[];
  totalCount: number;
  status: number;
};

export enum FilterComparator {
  Includes = 'includes',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEqual = 'is_equal',
  IsDifferent = 'is_different',
  IsLower = 'is_lower',
  IsHigher = 'is_higher',
  IsBefore = 'is_before',
  IsAfter = 'is_after',
  IsIn = 'is_in',
}

export const FilterCategories = {
  Numeric: [
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
    FilterComparator.IsLower,
    FilterComparator.IsHigher,
  ],
  String: [
    FilterComparator.Includes,
    FilterComparator.StartsWith,
    FilterComparator.EndsWith,
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
  ],
  Date: [
    FilterComparator.IsEqual,
    FilterComparator.IsDifferent,
    FilterComparator.IsBefore,
    FilterComparator.IsAfter,
  ],
};

export type FilterCategories = {
  Numeric: FilterComparator[];
  String: FilterComparator[];
  Date: FilterComparator[];
};

export type Filter = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
};

export type IcebergFetchParamsV6 = {
  page?: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
  disableCache?: boolean;
} & IcebergCommonOptions;

export type IcebergFetchParamsV2 = { cursor?: string } & IcebergCommonOptions;

export const useCoreApiClient = () => {
  const context = useContext(ManagerReactComponentContext);
  return {
    apiClient: context.apiClient,
    iceberg: context.iceberg,
  };
};
