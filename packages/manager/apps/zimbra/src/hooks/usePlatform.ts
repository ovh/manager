import { useQuery } from '@tanstack/react-query';
import {
  getZimbraPlatformList,
  getZimbraPlatformListQueryKey,
} from '@/api/platform';

export const usePlatform = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [getZimbraPlatformListQueryKey],
    queryFn: () => getZimbraPlatformList(),
  });

  return {
    isLoading,
    isError,
    error,
    platformId: data ? data[0].id : null,
    platformUrn: data ? data[0].iam.urn : null,
    data: data ? data[0] : null,
  };
};
