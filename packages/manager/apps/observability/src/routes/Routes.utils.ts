import { LocationPathParams, URL_PARAMS, UrlValue, urls } from '@/routes/Routes.constants';

export { getRoot } from '@/routes/Routes.base';

export function getDeleteTenantUrl(params: LocationPathParams) {
  return getURL(urls.deleteTenant, params);
}

export function getEditTenantUrl(params: LocationPathParams) {
  return getURL(urls.editTenant, params);
}

export function getTenantDashboardUrl(params: LocationPathParams) {
  return getURL(urls.tenantDashboard, params);
}

export function getTenantCreationUrl(params: Pick<LocationPathParams, 'resourceName'>) {
  return urls.tenantCreation.replace(URL_PARAMS.resourceName, params.resourceName);
}

export function getTenantSubscriptionUrl(params: LocationPathParams) {
  return getURL(urls.tenantSubscription, params);
}

export function getTenantTagsUrl(params: LocationPathParams) {
  return getURL(urls.tenantTags, params);
}

function getURL(url: UrlValue, params: LocationPathParams) {
  return url
    .replace(URL_PARAMS.resourceName, params.resourceName)
    .replace(URL_PARAMS.tenantId, params.tenantId);
}
