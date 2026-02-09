import { apiClient } from '@ovh-ux/manager-core-api';

import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana } from '@/types/managedDashboards.type';

export const getGrafanas = async ({
  resourceName,
  signal,
}: ObservabilityServiceParams): Promise<Grafana[]> => {
  const { data } = await apiClient.v2.get<Grafana[]>(
    `/observability/resource/${resourceName}/setting/grafana`,
    {
      signal,
    },
  );
  return data;
};
