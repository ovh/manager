import { queryOptions } from '@tanstack/react-query';

import { getPredefinedDashboard } from '../../../__mocks__/dashboards/dashboard.adapter';
import { getPredefinedDashboardQueryKey } from './getPredefinedDashboardQueryKey';

export const getPredefinedDashboardOptions = (resourceName: string, productType: string) =>
  queryOptions({
    queryKey: getPredefinedDashboardQueryKey(resourceName, productType),
    queryFn: ({ signal }) =>
      getPredefinedDashboard({
        resourceName,
        productType,
        signal,
      }),
  });

export default getPredefinedDashboardOptions;
