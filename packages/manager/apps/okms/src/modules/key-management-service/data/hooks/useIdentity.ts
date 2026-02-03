import {
  IdentityGroup,
  IdentityOauthClient,
  IdentityUser,
} from '@key-management-service/types/identity.type';
import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  getIdentityGroup,
  getIdentityGroupQueryKey,
  getIdentityGroupsIds,
  getIdentityGroupsIdsQueryKey,
  getIdentityServiceAccount,
  getIdentityServiceAccountQueryKey,
  getIdentityServiceAccountsIds,
  getIdentityServiceAccountsIdsQueryKey,
  getIdentityUser,
  getIdentityUserQueryKey,
  getIdentityUsersIds,
  getIdentityUsersIdsQueryKey,
} from '../api/identity';

const useIdentityList = <T>(
  idsQueryKeyFn: () => unknown[],
  idsQueryFn: () => Promise<string[]>,
  detailsQueryKeyFn: (id: string) => unknown[],
  detailsQueryFn: (id: string) => Promise<T>,
) => {
  const {
    data: listData,
    isLoading: isListLoading,
    isPending: isListPending,
    isError: isListError,
    error: listError,
  } = useQuery<string[], ApiError>({
    queryKey: idsQueryKeyFn(),
    queryFn: idsQueryFn,
  });

  const detailsQueries = useQueries({
    queries:
      !isListPending && !isListError
        ? listData.map(
            (id): UseQueryOptions<T, ApiError> => ({
              retry: false,
              queryKey: detailsQueryKeyFn(id),
              queryFn: () => detailsQueryFn(id),
            }),
          )
        : [],
  });

  const resultStatus = {
    isLoading: isListLoading || detailsQueries.some(({ isLoading }) => isLoading),
    isError: isListError || detailsQueries.some(({ isError }) => isError),
    error: listError || detailsQueries.find(({ error }) => error)?.error,
    identitiesInError: detailsQueries
      .map(({ isError }, index) => (isError ? listData?.[index] : null))
      .filter(Boolean),
  };

  const combinedData: T[] =
    !resultStatus.isLoading && !resultStatus.isError
      ? detailsQueries.reduce((acc, { data }) => {
          if (data) {
            return acc.concat(data);
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
