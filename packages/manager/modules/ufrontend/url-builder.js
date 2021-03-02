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

export const buildURL = (baseURL, path, params) => {
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

  return `${baseURL}${buildedPath}${queryString}`;
};

export const buildURLs = (routes) => {
  if (Array.isArray(routes)) {
    return routes.map(({ baseURL, path, params }) =>
      buildURL(baseURL, path, params),
    );
  }
  return Object.keys(routes).reduce((result, name) => {
    const { baseURL, path, params } = routes[name];
    return {
      ...result,
      [name]: buildURL(baseURL, path, params),
    };
  }, {});
};

export default {
  buildURL,
  buildURLs,
};
