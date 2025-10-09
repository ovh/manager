import { appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const subroutes = {
  tenants: 'tenants' as const,
  metrics: 'metrics' as const,
  onboarding: 'onboarding' as const,
  dashboards: 'dashboards' as const,
} as const;

export const urls = {
  root: getRoot(),
  dashboards: `${getRoot()}/${subroutes.dashboards}`,
  metrics: `${getRoot()}/${subroutes.metrics}`,
  tenants: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}`,
  tenantsOnboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${
    subroutes.onboarding
  }`,
  onboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.onboarding}`,
} as const;

export const redirectionApp = appName;
