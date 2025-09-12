import { FetchV2Params, FetchV2Result } from '@ovh-ux/manager-core-api';
import { InfiniteData } from '../../adapters/use-infinite-query';

export type UseV2Params = FetchV2Params & {
  fetchAll?: boolean;
  queryKey: string | string[];
  enabled?: boolean;
};

export type SelectData<TData = unknown> = {
  data: InfiniteData<FetchV2Result<TData>>;
  totalCount?: number;
  flattenData: TData[];
};
