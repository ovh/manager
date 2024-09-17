import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformMailingLists,
  getZimbraPlatformMailingListsQueryKey,
} from '@/api/mailinglist';

export const useMailingLists = (
  organizationId?: string,
  organizationLabel?: string,
) => {
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

  const { data, isLoading, isError, error } = useQuery({
    queryKey: getZimbraPlatformMailingListsQueryKey(
      platformId,
      queryParameters,
    ),
    queryFn: () => getZimbraPlatformMailingLists(platformId, queryParameters),
    enabled: !!platformId,
  });

  return {
    isLoading,
    isError,
    error,
    data,
  };
};
