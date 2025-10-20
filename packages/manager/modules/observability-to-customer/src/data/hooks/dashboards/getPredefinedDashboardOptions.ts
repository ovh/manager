import { queryOptions } from '@tanstack/react-query';

import { getPredefinedDashboard } from '../../../__mocks__/dashboards/dashboard.adapter';
import { getPredefinedDashboardQueryKey } from './getPredefinedDashboardQueryKey';

export const getPredefinedDashboardOptions = (serviceName: string, productType: string) =>
  queryOptions({
    queryKey: getPredefinedDashboardQueryKey(serviceName, productType),
    queryFn: ({ signal }) =>
      getPredefinedDashboard({
        serviceName,
        productType,
        signal,
      }),
  });
