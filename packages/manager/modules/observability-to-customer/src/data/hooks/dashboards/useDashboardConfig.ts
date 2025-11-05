import { useQuery } from '@tanstack/react-query';

import { getPredefinedDashboardOptions } from '@/data/hooks/dashboards/getPredefinedDashboardOptions';

export const useDashboardConfig = (resourceName: string, productType: string) => {
  return useQuery(getPredefinedDashboardOptions(resourceName, productType));
};
