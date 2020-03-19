import forEach from 'lodash/forEach';

const VERBS = ['get', 'put', 'post', 'delete'];

export default class APIExchange {
  /* @ngInject */
  constructor(WucApi, $q, constants, $cacheFactory) {
    const cache =
      $cacheFactory.get('exchangeService') || $cacheFactory('exchangeService');

    forEach(VERBS, (verb) => {
      this[verb] = (path, optionsParam) => {
        const options = optionsParam || {};
        options.cache = cache;
        options.cache.removeAll();

        return WucApi[verb](
          `${constants.swsProxyRootPath}email/exchange${path}`,
          options,
        ).then(
          (data) => data,
          (reason) => $q.reject(reason),
        );
      };
    });
  }
}
