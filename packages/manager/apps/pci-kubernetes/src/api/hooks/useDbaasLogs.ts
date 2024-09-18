import { useQueries, useQuery } from '@tanstack/react-query';
import { Filter } from '@ovh-ux/manager-core-api';
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
