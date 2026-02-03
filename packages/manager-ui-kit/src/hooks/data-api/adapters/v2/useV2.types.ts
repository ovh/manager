import type { FetchV2Params } from '@ovh-ux/manager-core-api';

import { DatagridColumn } from '@/components/datagrid/Datagrid.props';
import type { UrlParamValue } from '@/hooks/data-api/ports/useDataApi.types';

export type UseV2Params<TData = Record<string, unknown>> = FetchV2Params & {
  fetchAll?: boolean;
  cacheKey: string | string[];
  enabled?: boolean;
  urlParams?: {
    params: Record<string, UrlParamValue | undefined>;
    setParams: (params: Record<string, UrlParamValue | null | undefined>) => void;
    deleteParams: (key: string) => void;
    paramsToString?: () => string;
    searchParams?: string;
  };
  columns?: DatagridColumn<TData>[];
};

export type UseV2Data<TData = Record<string, unknown>> = {
  totalCount?: number;
  flattenData: TData[];
};
