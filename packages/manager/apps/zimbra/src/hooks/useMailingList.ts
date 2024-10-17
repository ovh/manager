import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformMailingListDetails,
  getZimbraPlatformMailingListDetailsQueryKey,
  MailingListType,
} from '@/api/mailinglist';

type UseMailingListParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'select'
> & {
  mailingListId?: string;
};

export const useMailingList = (props: UseMailingListParams = {}) => {
  const { platformId } = usePlatform();
  const { mailingListId, ...options } = props;
  return useQuery({
    ...options,
    queryKey: getZimbraPlatformMailingListDetailsQueryKey(
      platformId,
      mailingListId,
    ),
    queryFn: () =>
      getZimbraPlatformMailingListDetails(platformId, mailingListId),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!mailingListId &&
      !!platformId,
  }) as UseQueryResult<MailingListType>;
};
