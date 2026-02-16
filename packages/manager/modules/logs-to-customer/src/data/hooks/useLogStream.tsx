import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { getLogStream } from '@/data/api/logStream';
import { Service, Stream } from '@/data/types/dbaas/logs/Logs.type';

export const getLogStreamsQueryKey = (): string[] => ['getLogStreams'];

/**
 * Use log Stream
 */
export const getLogStreamQueryKey = (serviceName: Service['serviceName'], streamId: string) => [
  getLogStreamsQueryKey()[0],
  `/dbaas/logs/${serviceName}/output/graylog/stream/${streamId}`,
];

export const useLogStream = (
  serviceName: Service['serviceName'],
  streamId: string,
): UseQueryResult<Stream> => {
  return useQuery<Stream>({
    queryKey: getLogStreamQueryKey(serviceName, streamId),
    queryFn: () => getLogStream(serviceName, streamId),
  });
};
