import { LocationPathParams, URL_PARAMS, UrlValue, urls } from '@/routes/Routes.constants';

export function getRootUrl(params: LocationPathParams) {
  return getURL(urls.root, params);
}

export function getSubscriptionsConfigUrl(params?: LocationPathParams) {
  return getURL(urls.subscriptionsConfig, params);
}

export function getSubscriptionsConfigCreateTenantUrl(params?: LocationPathParams) {
  return getURL(urls.tenantCreation, params);
}

function getURL(url: UrlValue, params?: LocationPathParams) {
  return url
    .replace(URL_PARAMS.resourceName, params?.resourceName ?? '')
    .replace(URL_PARAMS.subscriptionId, params?.subscriptionId ?? '');
}
