import { FetchV2Params } from '@ovh-ux/manager-core-api';

export type UseV2Params = FetchV2Params & {
  fetchAll?: boolean;
  cacheKey: string | string[];
  enabled?: boolean;
};

export type UseV2Data<TData = Record<string, unknown>> = {
  totalCount?: number;
  flattenData: TData[];
};
