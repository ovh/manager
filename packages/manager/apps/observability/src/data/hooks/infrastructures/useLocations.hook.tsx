import { useQuery } from '@tanstack/react-query';

import { Location } from '@ovh-ux/shell';

import { getLocations } from '@/data/api/infrastructures.api';

export const useLocations = () => {
  // TODO: use MUK hook when available https://github.com/ovh/manager/pull/18990
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: ({ signal }) => getLocations(signal),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
