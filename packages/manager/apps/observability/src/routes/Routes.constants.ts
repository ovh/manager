import { appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const MetricSubRoutes = {
  tenants: 'tenants' as const,  
} as const;

export const urls = {
  root: getRoot(),
  dashboards: `dashboards`,
  metrics: 'metrics',  
} as const;

export const redirectionApp = appName;
