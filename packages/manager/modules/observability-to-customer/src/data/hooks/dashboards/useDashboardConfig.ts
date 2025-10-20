import { useQuery } from '@tanstack/react-query';

import { getPredefinedDashboardOptions } from './getPredefinedDashboardOptions';

export const useDashboardConfig = (serviceName: string, productType: string) => {
  return useQuery(getPredefinedDashboardOptions(serviceName, productType));
};
