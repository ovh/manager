import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  OrgDetails,
  getOrganisationsDetailsQueryKey,
  getOrganisationsDetails,
} from '@/data/api';

export type UseGetOrganisationsDetailsParams = {
  org: string;
  enabled?: boolean;
};

export const useGetOrganisationsDetails = ({
  org,
  enabled = true,
}: UseGetOrganisationsDetailsParams) => {
  const { data: orgDetailsResponse, isLoading, isError, error } = useQuery<
    ApiResponse<OrgDetails>,
    ApiError
  >({
    queryKey: getOrganisationsDetailsQueryKey({ org }),
    queryFn: () => getOrganisationsDetails({ org }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { orgDetails: orgDetailsResponse?.data, isLoading, isError, error };
};
