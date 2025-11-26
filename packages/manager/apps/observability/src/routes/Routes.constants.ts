import { appName } from '@/App.constants';

import { getRoot } from './Routes.base';

export const URL_PARAMS = {
  tenantId: ':tenantId',
};

export const subroutes = {
  tenants: 'tenants' as const,
  metrics: 'metrics' as const,
  onboarding: 'onboarding' as const,
  dashboards: 'dashboards' as const,
  delete: `delete/${URL_PARAMS.tenantId}` as const,
  edit: `${URL_PARAMS.tenantId}/edit` as const,
  creation: 'creation' as const,
  dashboard: `${URL_PARAMS.tenantId}` as const,
  subscription: 'subscription' as const,
  tags: 'tags' as const,
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
  editTenant: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.edit}`,
  tenantsCreation: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.creation}`,
  tenantDashboard: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.dashboard}`,
  tenantSubscription: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.dashboard}/${subroutes.subscription}`,
  tenantTags: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.dashboard}/${subroutes.tags}`,
  onboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.onboarding}`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]: string;
};

export const redirectionApp = appName;
