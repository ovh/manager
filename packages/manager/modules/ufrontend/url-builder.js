import { Environment } from '@ovh-ux/manager-config';

const getApplicationBaseURL = (applicationName) => {
  const applicationURL = Environment.getApplicationURL(applicationName);
  const currentApplicationURL = Environment.getApplicationURL(
    Environment.getApplicationName(),
  );

  if (applicationURL === currentApplicationURL) {
    return `${window.location.origin}${window.location.pathname}`;
  }

  return applicationURL;
};

const buildURLPattern = (pattern, params) => {
  let url = pattern;
  let filteredParams = params;

  if (pattern.includes(':') && params) {
    const PARAM_REGEXP = /:(\w+)/g;

    const urlParamTemplates = [...pattern.matchAll(PARAM_REGEXP)].map(
      ([, name]) => name,
    );

    urlParamTemplates.forEach((urlParam) => {
      if (params[urlParam]) {
        url = url.replace(`:${urlParam}`, encodeURIComponent(params[urlParam]));
      }
    });

    filteredParams = Object.keys(params).reduce((queryParams, paramName) => {
      if (!urlParamTemplates.includes(paramName)) {
        return {
          ...queryParams,
          [paramName]: params[paramName],
        };
      }
      return queryParams;
    }, {});
  }

  return { url, params: filteredParams };
};

const buildQueryString = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');

export const buildURL = (application, path, params) => {
  const applicationURL = getApplicationBaseURL(application);

  const { url: buildedPath, params: queryObject } = buildURLPattern(
    path,
    params,
  );

  let queryString = queryObject ? buildQueryString(queryObject) : '';
  if (queryString) {
    queryString = buildedPath.includes('?')
      ? `&${queryString}`
      : `?${queryString}`;
  }

  return `${applicationURL}${buildedPath}${queryString}`;
};

export const buildURLs = (routes) => {
  if (Array.isArray(routes)) {
    return routes.map(({ application, path, params }) =>
      buildURL(application, path, params),
    );
  }
  return Object.keys(routes).reduce((result, name) => {
    const { application, path, params } = routes[name];
    return {
      ...result,
      [name]: buildURL(application, path, params),
    };
  }, {});
};

export default {
  buildURL,
  buildURLs,
};
