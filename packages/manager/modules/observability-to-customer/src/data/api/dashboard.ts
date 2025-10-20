import apiClient from '@ovh-ux/manager-core-api';

import { ObservabilityDashboardParams } from '../../types/ClientApi.type';
import { Dashboard } from '../../types/observability.type';

export const getPredefinedDashboard = async ({
  resourceName,
  productType,
  signal,
}: ObservabilityDashboardParams): Promise<Dashboard> => {
  const url = `/observability/resource/${resourceName}/metric/dashboard/${productType}`;
  const { data } = await apiClient.v2.get<Dashboard>(url, {
    signal,
  });
  return data;
};
