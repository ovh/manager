import { useQuery } from '@tanstack/react-query';

import { getLogRetention } from '@/data/api/logRetention';
import { Service, Stream } from '@/data/types/dbaas/logs/Logs.type';

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
