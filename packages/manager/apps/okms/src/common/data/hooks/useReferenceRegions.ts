import { useQuery } from '@tanstack/react-query';

import { getReferenceRegions, referenceRegionsQueryKey } from '@/common/data/api/referenceRegions';
import { ErrorResponse } from '@/common/types/api.type';
import { ReferenceRegion } from '@/common/types/referenceRegions.type';

export const useReferenceRegions = () => {
  return useQuery<ReferenceRegion[], ErrorResponse>({
    queryKey: referenceRegionsQueryKey,
    queryFn: getReferenceRegions,
  });
};
