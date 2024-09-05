import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganization,
  getZimbraPlatformOrganizationQueryKey,
} from '@/api/organization';

export const useOrganizationList = () => {
  const { platformId } = usePlatform();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformOrganizationQueryKey(platformId),
    queryFn: () => getZimbraPlatformOrganization(platformId),
    enabled: !!platformId,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
