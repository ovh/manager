import { useCallback } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  Query,
  useQueries,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  getMoveIpAvailableDestinations,
  getMoveIpAvailableDestinationsQueryKey,
  getIpTaskList,
  postMoveIp as apiPostMoveIp,
  getIpDetailsQueryKey,
  getIpTaskDetailsQueryKey,
  getIpTaskDetails,
} from '@/data/api';
import { IpTaskStatus, IpTaskFunction, IpTask } from '@/types';
import { INVALIDATED_REFRESH_PERIOD, TRANSLATION_NAMESPACES } from '@/utils';

const getMoveIpOngoingTasksQueryKey = (ip: string) => [
  'ipMoveOngoingTasks',
  ip.includes('/') ? ip : `${ip}/32`,
];

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

  const taskQuery = useQuery<number[], ApiError>({
    queryKey: getMoveIpOngoingTasksQueryKey(ip),
    queryFn: async () => {
      try {
        const queries = await Promise.all(
          [IpTaskStatus.init, IpTaskStatus.todo, IpTaskStatus.doing].map(
            (status) =>
              getIpTaskList({
                ip,
                status,
                fn: IpTaskFunction.genericMoveFloatingIp,
              }),
          ),
        );
        return queries.flatMap((query) => query.data);
      } catch (error) {
        return [];
      }
    },
    enabled,
  });

  useQueries({
    queries: (taskQuery?.data ?? []).map((taskId) => ({
      queryKey: getIpTaskDetailsQueryKey({ ip, taskId }),
      queryFn: () => getIpTaskDetails({ ip, taskId }),
      refetchInterval: (query: Query<ApiResponse<IpTask>, ApiError>) => {
        if (
          !query.state.error &&
          [IpTaskStatus.init, IpTaskStatus.todo, IpTaskStatus.doing].includes(
            query.state.data?.data?.status,
          )
        ) {
          return INVALIDATED_REFRESH_PERIOD;
        }

        if (
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
        }

        if (query.state.data?.data?.status === IpTaskStatus.done) {
          clearNotifications();
          addSuccess(
            t('moveIpDoneMessage', {
              ip,
              ns: TRANSLATION_NAMESPACES.moveIp,
            }),
          );
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
    taskError: taskQuery.error as ApiError,
    hasOnGoingMoveIpTask: taskQuery?.data?.length > 0,
  };
}

export function useMoveIpService({
  ip,
  onMoveIpSuccess,
}: {
  ip: string;
  onMoveIpSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const { hasOnGoingMoveIpTask, isTasksLoading, taskError } = useMoveIpTasks({
    ip,
  });

  const {
    data: availableDestinations,
    isLoading: isAvailableDestinationsLoading,
    error: availableDestinationsError,
  } = useQuery({
    queryKey: getMoveIpAvailableDestinationsQueryKey(ip),
    queryFn: () => getMoveIpAvailableDestinations(ip),
    enabled: !isTasksLoading && !taskError && !hasOnGoingMoveIpTask,
  });

  const isDedicatedCloudService = useCallback(
    (destination: string) =>
      !!availableDestinations?.data?.dedicatedCloud.find(
        ({ service }) => service === destination,
      ),
    [availableDestinations?.data],
  );

  const getNextHopList = useCallback(
    (selectedDestinationService: string) => {
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
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: getMoveIpOngoingTasksQueryKey(ip),
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
