import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import keys from 'lodash/keys';

export default class CucControllerRequestHelper {
  /* @ngInject */
  constructor($q) {
    this.$q = $q;
  }

  getHashLoader(config) {
    const loader = {
      loading: false,
      data: {},
      hasErrors: false,
    };

    return this.getLoader(loader, config);
  }

  getArrayLoader(config) {
    const loader = {
      loading: false,
      data: undefined,
      promise: undefined,
      hasErrors: false,
    };

    return this.getLoader(loader, config);
  }

  getLoader(initialData = {}, configParam) {
    const loader = initialData;
    let config = configParam;

    if (isFunction(config)) {
      config = {
        loaderFunction: config,
      };
    }

    loader.load = () => {
      if (isArray(initialData.data) || keys(initialData.data).length === 0) {
        loader.loading = true;
      }
      const promise = this.$q
        .when(config.loaderFunction())
        .then((response) => {
          loader.data = response.data || response;
          loader.hasErrors = false;

          if (config.successHandler) {
            config.successHandler(response);
          }

          return response;
        })
        .catch((response) => {
          loader.hasErrors = true;

          if (config.errorHandler) {
            config.errorHandler(response);
          }

          return this.$q.reject(response);
        })
        .finally(() => {
          loader.loading = false;
        });
      loader.promise = promise;
      return promise;
    };

    return loader;
  }
}
