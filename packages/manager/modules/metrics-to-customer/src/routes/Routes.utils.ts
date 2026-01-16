import { LocationPathParams, URL_PARAMS, UrlValue, urls } from '@/routes/Routes.constants';

export function getRootUrl(params: LocationPathParams) {
  return getURL(urls.root, params);
}

export function getSubscriptionsConfigUrl(params?: LocationPathParams) {
  return getURL(urls.subscriptionsConfig, params);
}

function getURL(url: UrlValue, params?: LocationPathParams) {
  if (!params) {
    return url;
  }
  return url.replace(URL_PARAMS.resourceName, params.resourceName ?? '');
}
