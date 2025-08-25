import { useCallback } from 'react';
import { useQueries, useQuery, useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getMoveIpAvailableDestinations,
  getMoveIpAvailableDestinationsQueryKey,
  getIpTaskList,
  postMoveIp as apiPostMoveIp,
  getIpTaskQueryKey,
} from '@/data/api';
import { IpTaskStatus, IpTaskFunction } from '@/types';

const nextHopPccOption = 'newPrimaryIp';

export function useMoveIpService({
  ip,
  onMoveIpSuccess,
}: {
  ip: string;
  onMoveIpSuccess?: () => void;
}) {
  const taskQueries = useQueries({
    queries: [IpTaskStatus.init, IpTaskStatus.todo, IpTaskStatus.doing].map(
      (status) => ({
        queryKey: getIpTaskQueryKey({
          ip,
          status,
          fn: IpTaskFunction.genericMoveFloatingIp,
        }),
        queryFn: () =>
          getIpTaskList({
            ip,
            status,
            fn: IpTaskFunction.genericMoveFloatingIp,
          }),
      }),
    ),
  });

  const isTasksLoading = taskQueries.some((query) => query.isLoading);
  const taskError = taskQueries.find((query) => query.isError)?.error;
  const hasOnGoingMoveIpTask = taskQueries.some(
    (query) => query.data?.data && query.data.data.length > 0,
  );

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

      const range = parseInt(ip.split('/')[1], 10);

      const destinationsList = Object.values(
        availableDestinations?.data || {},
      ).flat();

      return Array.from(
        new Set(
          [
            ...(destinationsList.find(
              ({ service }) => service === selectedDestinationService,
            )?.nexthop || []),
            isDedicatedCloudService(selectedDestinationService) &&
              range >= 24 &&
              range <= 28 &&
              nextHopPccOption,
          ].filter(Boolean),
        ),
      );
    },
    [availableDestinations?.data, ip, isDedicatedCloudService],
  );

  const {
    mutate: postMoveIp,
    isPending: isMoveIpPending,
    error: moveIpError,
  } = useMutation({
    mutationFn: apiPostMoveIp,
    onSuccess: onMoveIpSuccess,
  });

  return {
    isMoveIpServiceLoading: isTasksLoading || isAvailableDestinationsLoading,
    moveIpServiceError: (availableDestinationsError ||
      taskError ||
      moveIpError) as ApiError,
    isDedicatedCloudService: (destination: string) =>
      !!availableDestinations?.data?.dedicatedCloud.find(
        ({ service }) => service === destination,
      ),
    hasOnGoingMoveIpTask,
    availableDestinations,
    getNextHopList,
    postMoveIp,
    isMoveIpPending,
  };
}
