import { UseDataApiOptions, UseDataApiResult, SearchProps } from '@ovh-ux/muk';
import { FilterComparator } from '@ovh-ux/manager-core-api';

export type UseDomainDataApiWithRouteParamsOptions<TData> = Omit<
  UseDataApiOptions<TData>,
  'route'
> & {
  baseRoute: string;
  columns?: unknown[];
};

export type FilterWithLabel = {
  key: string;
  value: string | string[];
  comparator: FilterComparator;
  label: string;
};

export type UseDomainDataApiWithRouteParamsResult<TData> = UseDataApiResult<
  TData
> & {
  data?: TData[];
  searchParams: URLSearchParams;
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean },
  ) => void;
  searchProps: SearchProps;
  filtersProps: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: FilterWithLabel) => void;
  };
};
