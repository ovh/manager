import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Filter, v6 } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import {
  getLogs,
  getRetention,
  getStream,
  getStreamURL,
  getStreams,
  getStreamsIds,
  getSubscriptions,
} from '../data/dbaas-logs';
import { pollLogOperation } from './useLogs';

export const useLogs = () =>
  useQuery({
    queryKey: ['dbaas-logs'],
    queryFn: getLogs,
  });

export const useStream = (serviceName: string, streamId: string) =>
  useQuery({
    queryKey: ['dbaas-logs-stream', serviceName, streamId],
    queryFn: () => getStream(serviceName, streamId),
  });

export const useStreams = (
  serviceName: string,
  pagination: PaginationState,
  filters: Filter[],
) =>
  useQuery({
    queryKey: [
      'dbaas-logs-streams',
      serviceName,
      JSON.stringify({ pagination, filters }),
    ],
    queryFn: () => getStreams(serviceName, pagination, filters),
  });

export const useAllStreamIds = () => {
  const { data: logs } = useLogs();
  return useQueries({
    queries:
      logs?.map((log) => ({
        queryKey: ['dbaas-logs-stream-id', log.serviceName],
        queryFn: () => getStreamsIds(log.serviceName),
      })) || [],
    combine: (result) => ({
      data: result?.map(({ data }) => data).flat(),
      isPending: result.some(({ isPending }) => isPending),
    }),
  });
};

export const useStreamURL = (serviceName: string, streamId: string) =>
  useQuery({
    queryKey: ['dbaas-logs-stream-url', serviceName, streamId],
    queryFn: () => getStreamURL(serviceName, streamId),
  });

export const useRetention = (
  serviceName: string,
  clusterId: string,
  retentionId: string,
) =>
  useQuery({
    queryKey: ['dbaas-logs-retention', serviceName, clusterId, retentionId],
    queryFn: () => getRetention(serviceName, clusterId, retentionId),
  });

export const useSubscriptions = (serviceName: string, streamId: string) =>
  useQuery({
    queryKey: ['dbaas-logs-subscriptions', serviceName, streamId],
    queryFn: () => getSubscriptions(serviceName, streamId),
  });

export interface CreateSubscriptionProps {
  logsApiURL: string;
  logsKind: string;
  streamId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export type TSubscriptionOperation = {
  operationId: string;
  serviceName: string;
};

export const useCreateSubscription = ({
  logsApiURL,
  logsKind,
  streamId,
  onError,
  onSuccess,
}: CreateSubscriptionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const { data: operation } = await v6.post<TSubscriptionOperation>(
        `${logsApiURL}/subscription`,
        {
          kind: logsKind,
          streamId,
        },
      );
      return pollLogOperation(operation.serviceName, operation.operationId);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-subscriptions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-streams'],
      });
      onSuccess();
    },
  });
  return {
    create: () => mutation.mutate(),
    ...mutation,
  };
};

export interface RemoveSubscriptionProps {
  logsApiURL: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useRemoveSubscription = ({
  logsApiURL,
  onError,
  onSuccess,
}: RemoveSubscriptionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data: operation } = await v6.delete<TSubscriptionOperation>(
        `${logsApiURL}/subscription/${subscriptionId}`,
      );
      return pollLogOperation(operation.serviceName, operation.operationId);
    },
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-subscriptions'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['dbaas-logs-streams'],
      });
      onSuccess();
    },
  });
  return {
    remove: (id: string) => mutation.mutate(id),
    ...mutation,
  };
};
