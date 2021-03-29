/**
 * opt = {
 *    method: get post put patch or delete
 *    url: url of sws or proxypass
 *    urlParams: params of url (replace {*})
 *    data: data of body for POST and PUT
 *    params: params in URL
 *    cache: cache key
 *    cacheTTL: cache valididy duration in milliseconds
 *    clearCache: if true clear cache of this url.
 *    If array, clear cache of this url in all cache key
 *    clearAllCache: if true clear all cache if this key. If array, clear all cache of all keys
 *    encodeParams: Encode params
 *    encodeUrlParams: Encode url params
 *    headers: http headers
 *
 *    returnSuccessKey: if String, return response.['String'] else response
 *    returnErrorKey: if String, return error.['String'] else error
 *    rootPath: begin url (provider conf)
 *    clearCacheVerb: table of [PUT POST DELETE]. remove automatically cache of url if method
 *    is in table(provider conf)
 * }
 */
import angular from 'angular';
import indexOf from 'lodash/indexOf';
import URI from 'urijs';
import 'urijs/src/URITemplate';

export default function () {
  const self = this;

  self.rootPath = '';
  self.clearCacheVerb = [];
  self.returnSuccessKey = null;
  self.returnErrorKey = null;

  self.$get = /* @ngInject */ function $get(
    $http,
    $q,
    $rootScope,
    $cacheFactory,
  ) {
    const api = {};

    api.cache = {};
    api.cacheTTL = {};

    function operation(opt) {
      // ------------ ENCODING HANDLING ------------

      if (opt.encodeParams === true) {
        angular.forEach(opt.params, (value, key) => {
          opt.params[key] = self.encode(value); // eslint-disable-line
        });
      }

      if (opt.encodeUrlParams === true) {
        angular.forEach(opt.urlParams, (value, key) => {
          opt.urlParams[key] = self.encode(value);  // eslint-disable-line
        });
      }

      // ------------ URL CRAFTING ------------
      const requestUrl = URI.expand(opt.url, opt.urlParams || {})
        .search(opt.params || {})
        .toString();
      const requestBody = opt.data ? angular.toJson(opt.data) : {};

      // ------------ CHECKING OPTION INTEGRITY ------------

      if (
        angular.isDefined(opt.cache) &&
        (!angular.isString(opt.cache) || opt.cache === '')
      ) {
        throw new Error('cache must be string (not empty)');
      }
      if (angular.isDefined(opt.cacheTTL) && !angular.isNumber(opt.cacheTTL)) {
        throw new Error('cacheTTL must be number (milliseconds)');
      }
      if (
        angular.isDefined(opt.clearAllCache) &&
        !(
          (angular.isString(opt.clearAllCache) && opt.clearAllCache !== '') ||
          angular.isArray(opt.clearAllCache) ||
          opt.clearAllCache === true ||
          opt.clearAllCache === false
        )
      ) {
        throw new Error(
          'clearAllCache must be array of string (not empty), string or boolean',
        );
      }
      if (
        angular.isDefined(opt.clearCache) &&
        !(
          (angular.isString(opt.clearCache) && opt.clearCache !== '') ||
          angular.isArray(opt.clearCache) ||
          opt.clearCache === true ||
          opt.clearCache === false
        )
      ) {
        throw new Error(
          'clearCache must be array of string (not empty), string or boolean',
        );
      }

      // ------------ CACHE INIT ------------

      if (opt.cache) {
        if (angular.isUndefined(api.cache[opt.cache])) {
          api.cache[opt.cache] = $cacheFactory(opt.cache);
          api.cacheTTL[opt.cache] = {};
        }
      }

      // ------------ CACHE ALL HANDLING ------------

      if (
        angular.isDefined(opt.clearAllCache) &&
        opt.clearAllCache !== null &&
        opt.clearAllCache !== false
      ) {
        if (opt.clearAllCache === true && angular.isDefined(opt.cache)) {
          api.cache[opt.cache].removeAll();
          api.cacheTTL[opt.cache] = {};
        } else if (angular.isArray(opt.clearAllCache)) {
          angular.forEach(opt.clearAllCache, (cache) => {
            if (
              angular.isDefined(cache) &&
              (!angular.isString(cache) || cache === '')
            ) {
              throw new Error(
                'clearAllCache must be array of string (not empty), string or boolean',
              );
            }
            if (api.cache[cache]) {
              api.cache[cache].removeAll();
              api.cacheTTL[cache] = {};
            }
          });
        } else if (api.cache[opt.clearAllCache]) {
          api.cache[opt.clearAllCache].removeAll();
          api.cacheTTL[opt.clearAllCache] = {};
        }
      }

      // ------------ CACHE URL HANDLING ------------

      if (
        angular.isDefined(opt.clearCache) &&
        opt.clearCache !== null &&
        opt.clearCache !== false
      ) {
        if (opt.clearCache === true && angular.isDefined(opt.cache)) {
          api.cache[opt.cache].remove(requestUrl);
          delete api.cacheTTL[opt.cache][requestUrl];
        } else if (angular.isArray(opt.clearCache)) {
          angular.forEach(opt.clearCache, (cache) => {
            if (
              angular.isDefined(cache) &&
              (!angular.isString(cache) || cache === '')
            ) {
              throw new Error(
                'clearCache must be array of string (not empty), string or boolean',
              );
            }
            if (api.cache[cache]) {
              api.cache[cache].remove(requestUrl);
              delete api.cacheTTL[cache][requestUrl];
            }
          });
        } else if (api.cache[opt.clearCache]) {
          api.cache[opt.clearCache].remove(requestUrl);
          delete api.cacheTTL[opt.clearCache][requestUrl];
        }
      }

      // ------------ CACHE BY VERB HANDLING ------------

      if (
        opt.cache &&
        indexOf(
          angular.isDefined(opt.clearCacheVerb) && opt.clearCacheVerb !== null
            ? opt.clearCacheVerb
            : self.clearCacheVerb,
          opt.method.toUpperCase(),
        ) !== -1
      ) {
        api.cache[opt.cache].remove(requestUrl);
        delete api.cacheTTL[opt.clearCache][requestUrl];
      }

      if (opt.cache && opt.cacheTTL && opt.method.toLowerCase() === 'get') {
        // ------------ CACHE TIMEOUT ------------
        const now = Date.now();

        if (api.cacheTTL[opt.cache] && api.cacheTTL[opt.cache][requestUrl]) {
          if (api.cacheTTL[opt.cache][requestUrl] < now) {
            api.cache[opt.cache].remove(requestUrl);
            api.cacheTTL[opt.cache][requestUrl] = now + opt.cacheTTL;
          }
        } else {
          api.cacheTTL[opt.cache][requestUrl] = now + opt.cacheTTL;
        }
      }

      // ------------ REQUEST ------------

      return $http({
        method: opt.method,
        url: requestUrl,
        data: requestBody,
        serviceType: opt.serviceType,
        timeout: opt.timeout,
        headers: opt.headers,
        cache:
          opt.method.toLowerCase() === 'get' && api.cache[opt.cache]
            ? api.cache[opt.cache]
            : false,
      }).then(
        (response) => {
          if (opt.broadcast) {
            if (opt.broadcastParam) {
              $rootScope.$broadcast(
                opt.broadcast,
                opt.broadcastParam,
                response,
              );
            } else {
              $rootScope.$broadcast(opt.broadcast, response);
            }
          }

          if (
            angular.isString(opt.returnSuccessKey) &&
            opt.returnSuccessKey !== ''
          ) {
            return response[opt.returnSuccessKey];
          }
          return response;
        },
        (error) => {
          if (
            angular.isString(opt.returnErrorKey) &&
            opt.returnErrorKey !== ''
          ) {
            return $q.reject(error[opt.returnErrorKey]);
          }
          return $q.reject(error);
        },
      );
    }

    api.schema = function schema(basePath, options) {
      return $http
        .get(
          angular.isObject(options) &&
            angular.isDefined(options.rootPath) &&
            options.rootPath !== null
            ? options.rootPath
            : self.rootPath + basePath,
          {
            cache: true,
          },
        )
        .then(
          (response) => response.data,
          (reason) => $q.reject(reason),
        );
    };

    api.models = function models(basePath, name, options) {
      return api.schema(basePath, options).then((schema) => {
        if (!name) {
          return schema.models;
        }
        return schema.models[name]
          ? schema.models[name].enum
          : $q.reject(schema.models);
      });
    };

    api.encode = function encode(param) {
      return window.encodeURIComponent(param);
    };

    angular.forEach(
      ['get', 'put', 'post', 'delete', 'patch'],
      (operationType) => {
        api[operationType] = function Api(url, optionsParams) {
          let options = optionsParams;
          if (!angular.isObject(options)) {
            options = {};
          }
          options.method = operationType.toUpperCase();
          options.url =
            (angular.isDefined(options.rootPath) && options.rootPath !== null
              ? options.rootPath
              : self.rootPath) + url;

          if (angular.isDefined(options.returnSuccessKey)) {
            if (!angular.isString(options.returnSuccessKey)) {
              throw new Error('returnSuccessKey must be string');
            }
          } else {
            options.returnSuccessKey = self.returnSuccessKey;
          }

          if (angular.isDefined(options.returnErrorKey)) {
            if (!angular.isString(options.returnErrorKey)) {
              throw new Error('returnErrorKey must be string');
            }
          } else {
            options.returnErrorKey = self.returnErrorKey;
          }

          return operation(options);
        };
      },
    );

    return api;
  };
}
