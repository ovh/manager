import { Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { getLogStream, getLogStreams } from '../api/logStream';
import { Service } from '../types/dbaas/logs';

/**
 * Use log Streams list
 */

export const getLogStreamsQueryKey = (
  serviceName: Service['serviceName'],
  pagination: PaginationState,
  filters: Filter[],
) => [
  'getLogStreams',
  `/dbaas/logs/${serviceName}/output/graylog/stream`,
  JSON.stringify({ pagination, filters }),
];

export const useLogStreams = (
  serviceName: Service['serviceName'],
  pagination: PaginationState,
  filters: Filter[],
) => {
  return useQuery({
    queryKey: getLogStreamsQueryKey(serviceName, pagination, filters),
    queryFn: () => getLogStreams(serviceName, pagination, filters),
  });
};

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
