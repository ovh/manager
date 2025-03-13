import { Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import { DeepReadonly } from '@/types/utils.type';

type FilterWithLabel = Filter & { label: string };

export type TUseInstancesQueryParams = DeepReadonly<{
  limit: number;
  sort: string;
  sortOrder: 'asc' | 'desc';
  filters: FilterWithLabel[];
}>;

const defaultParams: TUseInstancesQueryParams = {
  limit: 4,
  sort: 'name',
  sortOrder: 'asc',
  filters: [],
};

export const useInstancesQueryParams = (
  params?: Partial<TUseInstancesQueryParams>,
) => {
  return useMemo(() => ({ ...defaultParams, ...params }), [params]);
};
