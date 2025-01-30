import { useQuery } from '@tanstack/react-query';
import { getLogRetention } from '../api/logRetention';
import { Service, Stream } from '../types/dbaas/logs';

/**
 * Use log retention
 */
export const getLogRetentionQueryKey = (
  serviceName: Service['serviceName'],
  clusterId: Stream['clusterId'],
  retentionId: Stream['retentionId'],
) => ['getLogRetention', serviceName, clusterId, retentionId];

export const useLogRetention = (
  serviceName: Service['serviceName'],
  clusterId: Stream['clusterId'],
  retentionId: Stream['retentionId'],
) => {
  return useQuery({
    queryKey: getLogRetentionQueryKey(serviceName, clusterId, retentionId),
    queryFn: () => getLogRetention(serviceName, clusterId, retentionId),
  });
};
