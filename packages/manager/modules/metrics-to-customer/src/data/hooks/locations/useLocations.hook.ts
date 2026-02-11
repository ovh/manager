import { useQuery } from '@tanstack/react-query';

import { Location } from '@ovh-ux/shell';

import { getLocations } from '@/data/api/observability.api';

const staleTime = 30 * 60 * 1000; // 30 minutes
const gcTime = 60 * 60 * 1000; // 1 hour

export const useLocations = () => {
  return useQuery<Location[], Error>({
    queryKey: ['locations'],
    queryFn: ({ signal }) => getLocations(signal),
    staleTime,
    gcTime,
  });
};

export const useLocation = (name: string) => {
  const { data, isLoading, isFetching, error, isSuccess } = useLocations();

  const location = data?.find((loc) => loc.name === name);
  const notFound = isSuccess && !location;

  return {
    data: location,
    isLoading: isLoading || isFetching,
    isSuccess: isSuccess && !!location,
    isError: !!error || notFound,
    error: error ?? (notFound ? new Error(`Location "${name}" not found.`) : null),
  };
};
