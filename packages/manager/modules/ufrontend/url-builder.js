import { Environment } from '@ovh-ux/manager-config';

const buildQueryString = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export const buildURL = (application, url, query) => {
  let queryString = query ? buildQueryString(query) : '';

  if (queryString) {
    queryString = url.includes('?') ? `&${queryString}` : `?${queryString}`;
  }

  return `${Environment.getApplicationURL(application)}${url}${queryString}`;
};

export const buildURLs = (routes) => {
  if (Array.isArray(routes)) {
    return routes.map(({ application, url, query }) =>
      buildURL(application, url, query),
    );
  }
  return Object.keys(routes).reduce((result, name) => {
    const { application, url, query } = routes[name];
    return {
      ...result,
      [name]: buildURL(application, url, query),
    };
  }, {});
};

export default {
  buildURL,
  buildURLs,
};
