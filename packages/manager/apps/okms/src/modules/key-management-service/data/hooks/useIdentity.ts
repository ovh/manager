import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  IdentityUser,
  IdentityGroup,
  IdentityOauthClient,
} from '@key-management-service/types/identity.type';
import {
  getIdentityUsersIdsQueryKey,
  getIdentityUsersIds,
  getIdentityUserQueryKey,
  getIdentityUser,
  getIdentityGroupsIdsQueryKey,
  getIdentityGroupsIds,
  getIdentityGroup,
  getIdentityGroupQueryKey,
  getIdentityServiceAccountQueryKey,
  getIdentityServiceAccount,
  getIdentityServiceAccountsIdsQueryKey,
  getIdentityServiceAccountsIds,
} from '../api/identity';

const useIdentityList = <T>(
  idsQueryKeyFn: () => unknown[],
  idsQueryFn: () => Promise<ApiResponse<string[]>>,
  detailsQueryKeyFn: (id: string) => unknown[],
  detailsQueryFn: (id: string) => Promise<ApiResponse<T>>,
) => {
  const {
    data: listData,
    isLoading: isListLoading,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: idsQueryKeyFn(),
    queryFn: idsQueryFn,
  });

  const detailsQueries = useQueries({
    queries:
      !isListPending && !isListError
        ? listData.data.map(
            (id): UseQueryOptions<ApiResponse<T>, ApiError> => ({
              retry: false,
              queryKey: detailsQueryKeyFn(id),
              queryFn: () => detailsQueryFn(id),
            }),
          )
        : [],
  });

  const resultStatus = {
    isLoading:
      isListLoading || detailsQueries.some(({ isLoading }) => isLoading),
    isError: isListError || detailsQueries.some(({ isError }) => isError),
    error: listError || detailsQueries.find(({ error }) => error)?.error,
    identitiesInError: detailsQueries
      .map(({ isError }, index) => (isError ? listData?.data?.[index] : null))
      .filter(Boolean),
  };

  const combinedData: T[] =
    !resultStatus.isLoading && !resultStatus.isError
      ? detailsQueries.reduce((acc, { data }) => {
          if (data) {
            return acc.concat(data?.data);
          }
          return acc;
        }, [] as T[])
      : [];

  return {
    combinedData,
    ...resultStatus,
  };
};

export const useIdentityUserList = () =>
  useIdentityList<IdentityUser>(
    getIdentityUsersIdsQueryKey,
    getIdentityUsersIds,
    getIdentityUserQueryKey,
    getIdentityUser,
  );

export const useIdentityGroupList = () =>
  useIdentityList<IdentityGroup>(
    getIdentityGroupsIdsQueryKey,
    getIdentityGroupsIds,
    getIdentityGroupQueryKey,
    getIdentityGroup,
  );

export const useIdentityServiceAccountList = () =>
  useIdentityList<IdentityOauthClient>(
    getIdentityServiceAccountsIdsQueryKey,
    getIdentityServiceAccountsIds,
    getIdentityServiceAccountQueryKey,
    getIdentityServiceAccount,
  );
