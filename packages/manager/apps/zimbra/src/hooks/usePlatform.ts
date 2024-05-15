import { useQuery } from '@tanstack/react-query';
import { getZimbraPlatformList } from '@/api/GET/apiv2/services';

export const usePlatform = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['get/zimbra/platform'],
    queryFn: () => getZimbraPlatformList(),
  });

  return { isLoading, isError, error, platformId: data ? data[0]?.id : null };
};
