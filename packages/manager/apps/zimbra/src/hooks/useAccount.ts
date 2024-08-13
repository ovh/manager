import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformAccountDetail,
  getZimbraPlatformAccountDetailQueryKey,
} from '@/api/account';

export const useAccount = (accountId?: string, noCache?: boolean) => {
  const { platformId } = usePlatform();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformAccountDetailQueryKey(platformId, accountId),
    queryFn: () => getZimbraPlatformAccountDetail(platformId, accountId),
    enabled: !!accountId && !!platformId,
    gcTime: noCache ? 0 : 5000,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
