import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { ApiRegion } from '@/types/Region.type';

import { getRegion } from '../api/Region.api';

type TUseRegionResult = UseQueryResult<ApiRegion, Error>;

export const useRegion = (id: string): TUseRegionResult =>
  useQuery({
    queryKey: ['region', id],
    queryFn: () => getRegion(id),
    select: (res) => res.data,
  });
