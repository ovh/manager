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

export type UseGetOrganisationDetailsParams = {
  organisationId: string;
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
      (organisationId): UseQueryOptions<ApiResponse<OrgDetails>, ApiError> => ({
        queryKey: getOrganisationsDetailsQueryKey({
          organisationId,
        }),
        queryFn: () => getOrganisationsDetails({ organisationId }),
        enabled: !!organisationList?.data?.length,
      }),
    ),
  });

  const formattedResult = {
    isLoading: isLoading || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    orgDetails: results
      .map(({ data }) => data?.data)
      .sort((a, b) => {
        // Sort in reverse order based on organization ID
        // Assuming newer organizations have higher IDs
        return (b?.organisationId || '').localeCompare(a?.organisationId || '');
      }),
  };

  return formattedResult;
};

export const useGetSingleOrganisationDetail = ({
  organisationId,
  enabled = true,
}: UseGetOrganisationDetailsParams) => {
  const { data: organisationDetail, isLoading, isError } = useQuery({
    queryKey: getOrganisationsDetailsQueryKey({
      organisationId,
    }),
    queryFn: () => getOrganisationsDetails({ organisationId }),
    enabled,
  });

  const formattedResult = {
    isLoading,
    isError,
    orgDetail: organisationDetail?.data,
  };

  return formattedResult;
};
