import {
  UseQueryOptions,
  UseQueryResult,
  useQueries,
  useQuery,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  OrgDetails,
  getOrganisationList,
  getOrganisationListQueryKey,
  getOrganisationsDetails,
  getOrganisationsDetailsQueryKey,
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
  const { data: organisationList } = useQuery({
    queryKey: getOrganisationListQueryKey(),
    queryFn: getOrganisationList,
    enabled,
  });

  const results = useQueries({
    queries: (organisationList?.data || []).map(
      (
        organisationId: string,
      ): UseQueryOptions<ApiResponse<OrgDetails>, ApiError> => ({
        queryKey: getOrganisationsDetailsQueryKey({
          organisationId,
        }),
        queryFn: () => getOrganisationsDetails({ organisationId }),
        enabled: !!organisationList?.data?.length,
      }),
    ),
    combine: (
      queriesResults: UseQueryResult<ApiResponse<OrgDetails>, ApiError>[],
    ) => ({
      isPending: queriesResults.some((result) => result.isPending),
      isLoading: queriesResults.some((result) => result.isLoading),
      error: queriesResults.find((result) => result.error)?.error,
      data: queriesResults
        .map(({ data }) => data?.data)
        .sort((a, b) => {
          // Sort in reverse order based on organization ID
          // Assuming newer organizations have higher IDs
          return (b?.organisationId || '').localeCompare(
            a?.organisationId || '',
          );
        }),
    }),
  });
  return results;
};

export const useGetSingleOrganisationDetail = ({
  organisationId,
  enabled = true,
}: UseGetOrganisationDetailsParams) => {
  const {
    data: organisationDetail,
    isLoading,
    isError,
  } = useQuery({
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
