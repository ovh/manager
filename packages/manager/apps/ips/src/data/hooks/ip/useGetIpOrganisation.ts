import { useQueries, useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  IpDetails,
  getIpDetails,
  getIpDetailsQueryKey,
  getIpTaskList,
  getIpTaskQueryKey,
} from '@/data/api';
import { IpTaskFunction, IpTaskStatus } from '@/types';

export type UseGetIpOrganisationParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpOrganisation = ({
  ip,
  enabled = true,
}: UseGetIpOrganisationParams) => {
  const taskQueries = useQueries({
    queries: [IpTaskStatus.init, IpTaskStatus.todo, IpTaskStatus.doing].map(
      (status) => ({
        queryKey: getIpTaskQueryKey({
          ip,
          status,
          fn: IpTaskFunction.changeRipeOrg,
        }),
        queryFn: () =>
          getIpTaskList({
            ip,
            status,
            fn: IpTaskFunction.changeRipeOrg,
          }),
        staleTime: 0,
      }),
    ),
  });

  const isTasksLoading = taskQueries.some((query) => query.isLoading);
  const taskError = taskQueries.find((query) => query.isError)?.error;
  const hasOnGoingChangeRipeOrgTask = taskQueries.some(
    (query) => query.data?.data && query.data.data.length > 0,
  );

  const {
    data: ipDetailsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<IpDetails>, ApiError>({
    queryKey: getIpDetailsQueryKey({ ip }),
    queryFn: () => getIpDetails({ ip }),
    enabled:
      enabled && !isTasksLoading && !taskError && !hasOnGoingChangeRipeOrgTask,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    organisationId: ipDetailsResponse?.data.organisationId,
    rirForOrganisation: ipDetailsResponse?.data.rir,
    hasOnGoingChangeRipeOrgTask,
    isLoading: isLoading || isTasksLoading,
    isError: isError || !!taskError,
    error: error ?? taskError,
  };
};
