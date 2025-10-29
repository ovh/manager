import { appName } from '@/App.constants';

import { getRoot } from './Routes.utils';

export const URL_PARAMS = {
  tenantId: ':tenantId',
};

export const subroutes = {
  tenants: 'tenants' as const,
  metrics: 'metrics' as const,
  onboarding: 'onboarding' as const,
  dashboards: 'dashboards' as const,
  delete: `delete/${URL_PARAMS.tenantId}` as const,
} as const;

export const urls = {
  root: getRoot(),
  dashboards: `${getRoot()}/${subroutes.dashboards}`,
  metrics: `${getRoot()}/${subroutes.metrics}`,
  tenants: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}`,
  tenantsOnboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${
    subroutes.onboarding
  }`,
  deleteTenant: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.delete}`,
  onboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.onboarding}`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]: string;
};

export const redirectionApp = appName;
