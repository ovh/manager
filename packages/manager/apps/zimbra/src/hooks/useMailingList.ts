import { useQuery } from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformMailingListDetails,
  getZimbraPlatformMailingListDetailsQueryKey,
} from '@/api/mailinglist';

export const useMailingList = (mailingListId: string, noCache?: boolean) => {
  const { platformId } = usePlatform();

  return useQuery({
    queryKey: getZimbraPlatformMailingListDetailsQueryKey(
      platformId,
      mailingListId,
    ),
    queryFn: () =>
      getZimbraPlatformMailingListDetails(platformId, mailingListId),
    enabled: !!mailingListId && !!platformId,
    gcTime: noCache ? 0 : 5000,
  });
};
