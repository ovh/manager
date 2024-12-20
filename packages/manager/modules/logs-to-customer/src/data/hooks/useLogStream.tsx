import { useQuery } from '@tanstack/react-query';
import { getLogStream } from '../api/logStream';

export const getLogStreamQueryKey = (serviceName: string, streamId: string) => [
  'getLogStream',
  `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
];

export const useLogStream = (serviceName: string, streamId: string) => {
  return useQuery({
    queryKey: getLogStreamQueryKey(serviceName, streamId),
    queryFn: () => getLogStream(serviceName, streamId),
  });
};
