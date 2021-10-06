import { buildURL, buildURLs } from '@ovh-ux/ufrontend';

export default class CoreUrlBuilder {
  /* @ngInject */
  constructor(coreConfigProvider) {
    this.coreConfigProvider = coreConfigProvider;
  }

  buildURL(application, path, params) {
    return buildURL(
      this.coreConfigProvider.getApplicationBaseURL(application),
      path,
      params,
    );
  }

  buildURLs(routes) {
    if (Array.isArray(routes)) {
      return buildURLs(
        routes.map(({ application, path, params }) => ({
          baseURL: this.coreConfigProvider.getApplicationBaseURL(application),
          path,
          params,
        })),
      );
    }

    return buildURLs(
      Object.keys(routes).reduce((all, name) => {
        const { application, path, params } = routes[name];
        return {
          ...all,
          [name]: {
            baseURL: this.coreConfigProvider.getApplicationBaseURL(application),
            path,
            params,
          },
        };
      }, {}),
    );
  }

  $get() {
    return {
      buildURL: (application, path, params) =>
        this.buildURL(application, path, params),
      buildURLs: (routes) => this.buildURLs(routes),
    };
  }
}
