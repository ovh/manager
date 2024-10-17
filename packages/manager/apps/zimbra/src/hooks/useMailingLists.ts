import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformMailingLists,
  getZimbraPlatformMailingListsQueryKey,
  MailingListType,
} from '@/api/mailinglist';

type UseMailingListsParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'select'
> & {
  organizationId?: string;
  organizationLabel?: string;
};

export const useMailingLists = (props: UseMailingListsParams = {}) => {
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
  const { organizationId, organizationLabel, ...options } = props;
  const selectedOrganizationId =
    organizationId ?? searchParams.get('organizationId');
  const selectedOrganizationLabel =
    organizationLabel ?? searchParams.get('organizationLabel');

  const queryParameters = {
    ...(selectedOrganizationId && { organizationId: selectedOrganizationId }),
    ...(selectedOrganizationLabel && {
      organizationLabel: selectedOrganizationLabel,
    }),
  };

  return useQuery({
    ...options,
    queryKey: getZimbraPlatformMailingListsQueryKey(
      platformId,
      queryParameters,
    ),
    queryFn: () => getZimbraPlatformMailingLists(platformId, queryParameters),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId,
  }) as UseQueryResult<MailingListType[]>;
};
