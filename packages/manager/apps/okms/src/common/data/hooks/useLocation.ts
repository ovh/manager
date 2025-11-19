import { useQuery } from '@tanstack/react-query';

import { getLocations, locationQueryKeys } from '@/common/data/api/location';
import { ErrorResponse } from '@/common/types/api.type';
import { Location } from '@/common/types/location.type';

export const useLocations = () => {
  return useQuery<Location[], ErrorResponse>({
    queryKey: locationQueryKeys.list,
    queryFn: getLocations,
  });
};
