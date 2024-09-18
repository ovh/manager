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
    platformId: data?.length > 0 ? data[0].id : undefined,
    platformUrn: data?.length > 0 ? data[0].iam.urn : undefined,
    data: data?.length > 0 ? data[0] : null,
  };
};
