import { v6 } from '@ovh-ux/manager-core-api';
import { ClusterRetention, Service, Stream } from '../types/dbaas/logs';

/**
 * GET cluster retention
 */
export const getLogRetention = async (
  serviceName: Service['serviceName'],
  clusterId: Stream['clusterId'],
  retentionId: Stream['retentionId'],
) => {
  const { data } = await v6.get<ClusterRetention>(
    `/dbaas/logs/${serviceName}/cluster/${clusterId}/retention/${retentionId}`,
  );
  return data;
};
