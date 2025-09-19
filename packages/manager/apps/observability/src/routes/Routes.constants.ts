import { appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const MetricSubRoutes = {
  tenant: 'tenant' as const,  
} as const;

export const urls = {
  root: getRoot(),
  dashboards: `dashboards`,
  metric: 'metric',  
} as const;

export const redirectionApp = appName;
