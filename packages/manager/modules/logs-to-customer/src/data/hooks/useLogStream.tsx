import { useQuery } from '@tanstack/react-query';
import { getLogStream } from '../api/logStream';
import { Service } from '../types/dbaas/logs';

/**
 * Use log Stream
 */
export const getLogStreamQueryKey = (
  serviceName: Service['serviceName'],
  streamId: string,
) => [
  'getLogStream',
  `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
];

export const useLogStream = (
  serviceName: Service['serviceName'],
  streamId: string,
) => {
  return useQuery({
    queryKey: getLogStreamQueryKey(serviceName, streamId),
    queryFn: () => getLogStream(serviceName, streamId),
  });
};
