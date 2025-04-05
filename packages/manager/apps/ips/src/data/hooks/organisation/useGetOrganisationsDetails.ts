import { useQuery, useQueries, UseQueryOptions } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  OrgDetails,
  getOrganisationsDetailsQueryKey,
  getOrganisationsDetails,
  getOrganisationListQueryKey,
  getOrganisationList,
} from '@/data/api';

export type UseGetOrganisationsDetailsParams = {
  enabled?: boolean;
};

export const useGetOrganisationsDetails = ({
  enabled = true,
}: UseGetOrganisationsDetailsParams) => {
  const { data: organisationList, isLoading, isError } = useQuery({
    queryKey: getOrganisationListQueryKey(),
    queryFn: getOrganisationList,
    enabled,
  });

  const results = useQueries({
    queries: (organisationList?.data || []).map(
      (org): UseQueryOptions<ApiResponse<OrgDetails>, ApiError> => ({
        queryKey: getOrganisationsDetailsQueryKey({
          org,
        }),
        queryFn: () => getOrganisationsDetails({ org }),
        enabled: !!organisationList?.data?.length,
      }),
    ),
  });

  const formattedResult = {
    isLoading: isLoading || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    orgDetails: results.map(({ data }) => data?.data),
  };

  return formattedResult;
};
