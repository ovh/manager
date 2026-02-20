import { appName } from '@/App.constants';
import { getRoot } from '@/routes/Routes.base';

export const URL_PARAMS = {
  tenantId: ':tenantId',
  resourceName: ':resourceName',
  subscriptionId: ':subscriptionId',
  managedDashboardId: ':managedDashboardId',
};

export const subroutes = {
  tenants: 'tenants',
  resource: URL_PARAMS.resourceName,
  metrics: 'metrics',
  settings: 'settings',
  services: 'services',
  managedDashboards: 'managed-dashboards',
  managedDashboard: URL_PARAMS.managedDashboardId,
  onboarding: 'onboarding',
  dashboards: 'dashboards',
  deleteTenant: `delete/${URL_PARAMS.tenantId}`,
  deleteTenantSubscription: `delete/${URL_PARAMS.subscriptionId}`,
  deleteManagedDashboard: `delete/${URL_PARAMS.managedDashboardId}`,
  edit: 'edit',
  creation: 'creation',
  delete: 'delete',
  tenant: URL_PARAMS.tenantId,
  subscription: 'subscription',
  tags: 'tags',
} as const;

export const urls = {
  root: getRoot(),
  metrics: `${getRoot()}/${subroutes.metrics}`,
  tenants: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}`,
  tenantsOnboarding: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${
    subroutes.onboarding
  }`,
  deleteTenant: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.deleteTenant}`,
  editTenant: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.tenant}/${subroutes.edit}`,
  tenantCreation: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.creation}`,
  tenantDashboard: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.tenant}`,
  tenantSubscription: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.tenant}/${subroutes.subscription}`,
  deleteTenantSubscription: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.tenant}/${subroutes.subscription}/${subroutes.deleteTenantSubscription}`,
  tenantTags: `${getRoot()}/${subroutes.metrics}/${subroutes.tenants}/${subroutes.resource}/${subroutes.tenant}/${subroutes.tags}`,
  settings: `${getRoot()}/${subroutes.settings}`,
  services: `${getRoot()}/${subroutes.settings}/${subroutes.services}`,
  servicesOnboarding: `${getRoot()}/${subroutes.settings}/${subroutes.services}/${subroutes.onboarding}`,
  deleteService: `${getRoot()}/${subroutes.settings}/${subroutes.services}/${subroutes.delete}`,
  editService: `${getRoot()}/${subroutes.settings}/${subroutes.services}/${subroutes.edit}`,
  managedDashboards: `${getRoot()}/${subroutes.settings}/${subroutes.managedDashboards}`,
  managedDashboardsOnboarding: `${getRoot()}/${subroutes.settings}/${subroutes.managedDashboards}/${
    subroutes.onboarding
  }`,
  managedDashboardCreation: `${getRoot()}/${subroutes.settings}/${subroutes.managedDashboards}/${subroutes.resource}/${subroutes.creation}`,
  editManagedDashboard: `${getRoot()}/${subroutes.settings}/${subroutes.managedDashboards}/${subroutes.resource}/${subroutes.managedDashboard}/${subroutes.edit}`,
  deleteManagedDashboard: `${getRoot()}/${subroutes.settings}/${subroutes.managedDashboards}/${subroutes.deleteManagedDashboard}`,
} as const;

export type LocationPathParams = {
  [K in keyof typeof URL_PARAMS]?: string;
};

export type UrlValue = (typeof urls)[keyof typeof urls];

export const redirectionApp = appName;
