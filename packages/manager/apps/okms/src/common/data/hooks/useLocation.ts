import { useQuery } from '@tanstack/react-query';
import { Location } from '@secret-manager/types/location.type';
import { ErrorResponse } from '@/types/api.type';
import { getLocations, locationQueryKeys } from '@/common/data/api/location';

export const useLocations = () => {
  return useQuery<Location[], ErrorResponse>({
    queryKey: locationQueryKeys.list,
    queryFn: getLocations,
  });
};
