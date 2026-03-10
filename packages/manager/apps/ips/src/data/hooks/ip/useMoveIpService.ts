import { useCallback } from 'react';

import {
  Query,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import {
  MoveIpAvailableDestinationsResponse,
  postMoveIp as apiPostMoveIp,
  getIcebergIpTaskList,
  getIpDetailsQueryKey,
  getIpTaskDetails,
  getIpTaskDetailsQueryKey,
  getMoveIpAvailableDestinations,
  getMoveIpAvailableDestinationsQueryKey,
  getVrackTaskDetails,
  getVrackTaskDetailsQueryKey,
  getVrackTaskList,
  getVrackTaskQueryKey,
} from '@/data/api';
import { IpTypeEnum } from '@/data/constants';
import {
  IpTask,
  IpTaskFunction,
  IpTaskStatus,
  VrackTask,
  VrackTaskFunction,
  VrackTaskStatus,
} from '@/types';
import {
  INVALIDATED_REFRESH_PERIOD,
  TRANSLATION_NAMESPACES,
  getTypeByServiceName,
} from '@/utils';

const getMoveIpOngoingTasksQueryKey = (ip: string) => [
  'ipMoveOngoingTasks',
  ip.includes('/') ? ip : `${ip}/32`,
];

export function useVrackMoveTasks({
  ip,
  serviceName,
  enabled = true,
}: {
  ip: string;
  serviceName?: string | null;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.ips,
    TRANSLATION_NAMESPACES.moveIp,
  ]);
  const { clearNotifications, addSuccess } = useNotifications();
  const { trackPage } = useOvhTracking();
  const { data, isLoading } = useQuery({
    queryKey: getVrackTaskQueryKey({ serviceName }),
    queryFn: () => getVrackTaskList({ serviceName }),
    retry: false,
    enabled:
      !!serviceName &&
      getTypeByServiceName(serviceName) === IpTypeEnum.VRACK &&
      enabled,
  });

  const queries = useQueries({
    queries: (data?.data ?? []).map((taskId) => ({
      queryKey: getVrackTaskDetailsQueryKey({ serviceName, taskId }),
      queryFn: async () => {
        try {
          return await getVrackTaskDetails({ serviceName, taskId });
        } catch (err) {
          if ((err as ApiError).status === 404) {
            clearNotifications();
            addSuccess(
              t('moveIpDoneMessage', {
                ip,
                ns: TRANSLATION_NAMESPACES.moveIp,
              }),
            );
            trackPage({
              pageType: PageType.bannerSuccess,
              pageName: 'move-ip_success',
            });
            queryClient.invalidateQueries({
              queryKey: getIpDetailsQueryKey({ ip }),
            });
            return {} as ApiResponse<VrackTask>;
          }
          throw err;
        }
      },
      refetchInterval: (query: Query<ApiResponse<VrackTask>, ApiError>) => {
        if (
          !query.state.error &&
          query.state.data?.data?.function &&
          [
            VrackTaskFunction.addBlockToBridgeDomain,
            VrackTaskFunction.removeBlockFromBridgeDomain,
          ].includes(query.state.data.data.function)
        ) {
          if (
            query.state.data?.data?.status &&
            [
              VrackTaskStatus.init,
              VrackTaskStatus.todo,
              VrackTaskStatus.doing,
            ].includes(query.state.data.data.status)
          ) {
            return INVALIDATED_REFRESH_PERIOD;
          }

          if (query.state.data?.data?.status === VrackTaskStatus.done) {
            clearNotifications();
            addSuccess(
              t('moveIpDoneMessage', {
                ip,
                ns: TRANSLATION_NAMESPACES.moveIp,
              }),
            );
            trackPage({
              pageType: PageType.bannerSuccess,
              pageName: 'move-ip_success',
            });
            queryClient.invalidateQueries({
              queryKey: getIpDetailsQueryKey({ ip }),
            });
          }

          return undefined;
        }

        return undefined;
      },
    })),
  });

  return {
    isVrackTasksLoading: isLoading || queries.some((q) => q.isLoading),
    vrackTasksError: queries.find((q) => q.error)?.error as ApiError,
    hasOnGoingVrackMoveTasks:
      queries.map((q) => q.data).filter((d): d is ApiResponse<VrackTask> => !!d)
        .length > 0,
  };
}

export function useMoveIpTasks({
  ip,
  enabled,
}: {
  ip: string;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.ips,
    TRANSLATION_NAMESPACES.moveIp,
  ]);
  const { clearNotifications, addError, addSuccess } = useNotifications();
  const { trackPage } = useOvhTracking();

  const taskQuery = useQuery<number[], ApiError>({
    queryKey: getMoveIpOngoingTasksQueryKey(ip),
    queryFn: async () => {
      try {
        const tasks = await getIcebergIpTaskList(ip);
        return tasks.data
          .filter(
            (task) =>
              task.function === IpTaskFunction.genericMoveFloatingIp &&
              [
                IpTaskStatus.init,
                IpTaskStatus.todo,
                IpTaskStatus.doing,
              ].includes(task.status),
          )
          .map((task) => task.taskId);
      } catch {
        return [];
      }
    },
    enabled,
  });

  useQueries({
    queries: (taskQuery?.data ?? []).map((taskId) => ({
      queryKey: getIpTaskDetailsQueryKey({ ip, taskId }),
      queryFn: () => getIpTaskDetails({ ip, taskId }),
      retry: false,
      refetchInterval: (query: Query<ApiResponse<IpTask>, ApiError>) => {
        if (
          !query.state.error &&
          query.state.data?.data?.status &&
          [IpTaskStatus.init, IpTaskStatus.todo, IpTaskStatus.doing].includes(
            query.state.data?.data?.status,
          )
        ) {
          return INVALIDATED_REFRESH_PERIOD;
        }

        if (
          query.state.data?.data?.status &&
          [
            IpTaskStatus.customError,
            IpTaskStatus.ovhError,
            IpTaskStatus.cancelled,
          ].includes(query.state.data?.data?.status)
        ) {
          clearNotifications();
          addError(
            t('task_error_message', {
              status: t(`ip_task_status_${query.state.data?.data?.status}`),
              comment: query.state.data?.data?.comment,
            }),
            true,
          );
          trackPage({
            pageType: PageType.bannerError,
            pageName: 'move-ip_error',
          });
        }

        if (query.state.data?.data?.status === IpTaskStatus.done) {
          clearNotifications();
          addSuccess(
            t('moveIpDoneMessage', {
              ip,
              ns: TRANSLATION_NAMESPACES.moveIp,
            }),
          );
          trackPage({
            pageType: PageType.bannerSuccess,
            pageName: 'move-ip_success',
          });
        }

        queryClient.setQueryData(
          getMoveIpOngoingTasksQueryKey(ip),
          (oldData: number[]) =>
            !oldData
              ? oldData
              : oldData.filter((id) => id !== query.state.data?.data?.taskId),
        );

        queryClient.invalidateQueries({
          queryKey: getIpDetailsQueryKey({ ip }),
        });

        return undefined;
      },
    })),
  });

  return {
    isTasksLoading: taskQuery.isLoading,
    taskError: taskQuery.error,
    hasOnGoingMoveIpTask: taskQuery?.data && taskQuery?.data?.length > 0,
  };
}

export function useMoveIpService({
  ip,
  serviceName,
  onMoveIpSuccess,
}: {
  ip: string;
  serviceName?: string | null;
  onMoveIpSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const { hasOnGoingVrackMoveTasks, isVrackTasksLoading, vrackTasksError } =
    useVrackMoveTasks({
      ip,
      serviceName,
      enabled:
        !!serviceName && getTypeByServiceName(serviceName) === IpTypeEnum.VRACK,
    });
  const { hasOnGoingMoveIpTask, isTasksLoading, taskError } = useMoveIpTasks({
    ip,
  });

  const {
    data: availableDestinations,
    isLoading: isAvailableDestinationsLoading,
    error: availableDestinationsError,
  } = useQuery({
    queryKey: getMoveIpAvailableDestinationsQueryKey(ip),
    queryFn: async () => {
      try {
        return await getMoveIpAvailableDestinations(ip);
      } catch {
        return {
          data: {
            dedicatedCloud: [],
            ipLoadbalancing: [],
            vps: [],
            hostingReseller: [],
            cloudProject: [],
            dedicatedServer: [],
          } as MoveIpAvailableDestinationsResponse,
        };
      }
    },
    enabled:
      !isTasksLoading &&
      !taskError &&
      !hasOnGoingMoveIpTask &&
      !hasOnGoingVrackMoveTasks &&
      !isVrackTasksLoading &&
      !vrackTasksError,
  });

  const isDedicatedCloudService = useCallback(
    (destination: string) =>
      !!availableDestinations?.data?.dedicatedCloud.find(
        ({ service }) => service === destination,
      ),
    [availableDestinations?.data],
  );

  const getNextHopList = useCallback(
    (selectedDestinationService?: string) => {
      if (!selectedDestinationService) {
        return [];
      }

      const destinationsList = Object.values(
        availableDestinations?.data || {},
      ).flat();

      return (
        destinationsList.find(
          ({ service }) => service === selectedDestinationService,
        )?.nexthop || []
      );
    },
    [availableDestinations?.data],
  );

  const {
    mutate: postMoveIp,
    isPending: isMoveIpPending,
    error: moveIpError,
  } = useMutation({
    mutationFn: apiPostMoveIp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          serviceName && getTypeByServiceName(serviceName) === IpTypeEnum.VRACK
            ? getVrackTaskQueryKey({ serviceName })
            : getMoveIpOngoingTasksQueryKey(ip),
      });
      onMoveIpSuccess?.();
    },
  });

  return {
    isMoveIpServiceLoading: isTasksLoading || isAvailableDestinationsLoading,
    moveIpServiceError: (availableDestinationsError ||
      taskError ||
      moveIpError) as ApiError,
    isDedicatedCloudService,
    hasOnGoingMoveIpTask,
    availableDestinations,
    getNextHopList,
    postMoveIp,
    isMoveIpPending,
  };
}
