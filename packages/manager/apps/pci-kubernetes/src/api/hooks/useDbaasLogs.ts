import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getLogs,
  getStream,
  getStreamURL,
  getStreams,
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

export const useStreams = () => {
  const { data: logs } = useLogs();
  return useQueries({
    queries:
      logs?.map((log) => ({
        queryKey: ['dbaas-logs-streams', log.serviceName],
        queryFn: () => getStreams(log.serviceName),
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
