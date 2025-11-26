import { urls } from './Routes.constants';

export { getRoot } from './Routes.base';

export function getDeleteTenantUrl(tenantId: string) {
  return urls.deleteTenant.replace(':tenantId', tenantId);
}

export function getEditTenantUrl(tenantId: string) {
  return urls.editTenant.replace(':tenantId', tenantId);
}

export function getTenantDashboardUrl(tenantId: string) {
  return urls.tenantDashboard.replace(':tenantId', tenantId);
}

export function getTenantSubscriptionUrl(tenantId: string) {
  return urls.tenantSubscription.replace(':tenantId', tenantId);
}

export function getTenantTagsUrl(tenantId: string) {
  return urls.tenantTags.replace(':tenantId', tenantId);
}
