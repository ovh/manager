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
  'queryKey' | 'queryFn' | 'select' | 'enabled'
> & {
  organizationId?: string;
  organizationLabel?: string;
};

export const useMailingLists = (props: UseMailingListsParams = {}) => {
  const { organizationId, organizationLabel, ...options } = props;
  const { platformId } = usePlatform();
  const [searchParams] = useSearchParams();
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
    queryKey: getZimbraPlatformMailingListsQueryKey(
      platformId,
      queryParameters,
    ),
    queryFn: () => getZimbraPlatformMailingLists(platformId, queryParameters),
    enabled: !!platformId,
    ...options,
  }) as UseQueryResult<MailingListType[]>;
};
