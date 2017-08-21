angular.module("ovh-angular-http", []);

/**
 * opt = {
 *    method: get post put patch or delete
 *    url: url of sws or proxypass
 *    urlParams: params of url (replace {*})
 *    data: data of body for POST and PUT
 *    params: params in URL
 *    cache: cache key
 *    cacheTTL: cache valididy duration in milliseconds
 *    clearCache: if true clear cache of this url. If array, clear cache of this url in all cache key
 *    clearAllCache: if true clear all cache if this key. If array, clear all cache of all keys
 *    encodeParams: Encode params
 *    encodeUrlParams: Encode url params
 *    headers: http headers
 *
 *    returnSuccessKey: if String, return response.['String'] else response
 *    returnErrorKey: if String, return error.['String'] else error
 *    rootPath: begin url (provider conf)
 *    clearCacheVerb: table of [PUT POST DELETE]. remove automatically cache of url if method is in table(provider conf)
 * }
 */
angular.module("ovh-angular-http").provider("OvhHttp", function () {
    "use strict";

    var self = this;

    self.rootPath = "";
    self.clearCacheVerb = [];
    self.returnSuccessKey = null;
    self.returnErrorKey = null;

    self.$get = ["$http", "$q", "$rootScope", "$cacheFactory", function ($http, $q, $rootScope, $cacheFactory) {

        var api = {};

        api.cache = {};
        api.cacheTTL = {};

        function operation (opt) {

            // ------------ ENCODING HANDLING ------------

            if (opt.encodeParams === true) {
                angular.forEach(opt.params, function (value, key) {
                    opt.params[key] = self.encode(value);
                });
            }

            if (opt.encodeUrlParams === true) {
                angular.forEach(opt.urlParams, function (value, key) {
                    opt.urlParams[key] = self.encode(value);
                });
            }

            // ------------ URL CRAFTING ------------
            var requestUrl = URI.expand(opt.url, opt.urlParams || {}).search(opt.params || {}).toString();
            var requestBody = opt.data ? angular.toJson(opt.data) : {};

            // ------------ CHECKING OPTION INTEGRITY ------------

            if (angular.isDefined(opt.cache) && (!angular.isString(opt.cache) || opt.cache === "")) {
                throw "cache must be string (not empty)";
            }
            if (angular.isDefined(opt.cacheTTL) && !angular.isNumber(opt.cacheTTL)) {
                throw "cacheTTL must be number (milliseconds)";
            }
            if (angular.isDefined(opt.clearAllCache) &&
                    !((angular.isString(opt.clearAllCache) && opt.clearAllCache !== "") ||
                    angular.isArray(opt.clearAllCache) ||
                    opt.clearAllCache === true ||
                    opt.clearAllCache === false)
            ) {
                throw "clearAllCache must be array of string (not empty), string or boolean";
            }
            if (angular.isDefined(opt.clearCache) &&
                    !((angular.isString(opt.clearCache) && opt.clearCache !== "") ||
                    angular.isArray(opt.clearCache) ||
                    opt.clearCache === true ||
                    opt.clearCache === false)
            ) {
                throw "clearCache must be array of string (not empty), string or boolean";
            }

            // ------------ CACHE INIT ------------

            if (opt.cache) {
                if (angular.isUndefined(api.cache[opt.cache])) {
                    api.cache[opt.cache] = $cacheFactory(opt.cache);
                    api.cacheTTL[opt.cache] = {};
                }
            }


            // ------------ CACHE ALL HANDLING ------------

            if (angular.isDefined(opt.clearAllCache) && opt.clearAllCache !== null && opt.clearAllCache !== false) {
                if (opt.clearAllCache === true && angular.isDefined(opt.cache)) {
                    api.cache[opt.cache].removeAll();
                    api.cacheTTL[opt.cache] = {};
                } else if (angular.isArray(opt.clearAllCache)) {
                    angular.forEach(opt.clearAllCache, function (cache) {
                        if (angular.isDefined(cache) && (!angular.isString(cache) || cache === "")) {
                            throw "clearAllCache must be array of string (not empty), string or boolean";
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

            if (angular.isDefined(opt.clearCache) && opt.clearCache !== null && opt.clearCache !== false) {
                if (opt.clearCache === true && angular.isDefined(opt.cache)) {
                    api.cache[opt.cache].remove(requestUrl);
                    delete api.cacheTTL[opt.cache][requestUrl];
                } else if (angular.isArray(opt.clearCache)) {
                    angular.forEach(opt.clearCache, function (cache) {
                        if (angular.isDefined(cache) && (!angular.isString(cache) || cache === "")) {
                            throw "clearCache must be array of string (not empty), string or boolean";
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

            if (opt.cache && _.indexOf(angular.isDefined(opt.clearCacheVerb) && opt.clearCacheVerb !== null ? opt.clearCacheVerb : self.clearCacheVerb, angular.uppercase(opt.method)) !== -1) {
                api.cache[opt.cache].remove(requestUrl);
                delete api.cacheTTL[opt.clearCache][requestUrl];
            }

            if (opt.cache && opt.cacheTTL && opt.method.toLowerCase() === "get") {

                // ------------ CACHE TIMEOUT ------------
                var now = Date.now();

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
                cache: opt.method.toLowerCase() === "get" && api.cache[opt.cache] ? api.cache[opt.cache] : false
            }).then(function (response) {

                if (opt.broadcast) {
                    if (opt.broadcastParam) {
                        $rootScope.$broadcast(opt.broadcast, opt.broadcastParam, response);
                    } else {
                        $rootScope.$broadcast(opt.broadcast, response);
                    }
                }

                if (angular.isString(opt.returnSuccessKey) && opt.returnSuccessKey !== "") {
                    return response[opt.returnSuccessKey];
                }
                return response;

            }, function (error) {

                if (angular.isString(opt.returnErrorKey) && opt.returnErrorKey !== "") {
                    return $q.reject(error[opt.returnErrorKey]);
                }
                return $q.reject(error);
            });
        }

        api.schema = function (basePath, options) {
            return $http.get(angular.isObject(options) && angular.isDefined(options.rootPath) && options.rootPath !== null ? options.rootPath : self.rootPath + basePath, {
                cache: true
            }).then(function (response) {
                return response.data;
            }, function (reason) {
                return $q.reject(reason);
            });
        };

        api.models = function (basePath, name, options) {
            return api.schema(basePath, options).then(function (schema) {
                if (!name) {
                    return schema.models;
                }
                return schema.models[name] ? schema.models[name].enum : $q.reject(schema.models);
            });
        };

        api.encode = function (param) {
            return window.encodeURIComponent(param);
        };

        angular.forEach(["get", "put", "post", "delete", "patch"], function (operationType) {
            api[operationType] = function (url, optionsParams) {
                var options = optionsParams;
                if (!angular.isObject(options)) {
                    options = {};
                }
                options.method = angular.uppercase(operationType);
                options.url = (angular.isDefined(options.rootPath) && options.rootPath !== null ? options.rootPath : self.rootPath) + url;

                if (angular.isDefined(options.returnSuccessKey)) {
                    if (!angular.isString(options.returnSuccessKey)) {
                        throw "returnSuccessKey must be string";
                    }
                } else {
                    options.returnSuccessKey = self.returnSuccessKey;
                }

                if (angular.isDefined(options.returnErrorKey)) {
                    if (!angular.isString(options.returnErrorKey)) {
                        throw "returnErrorKey must be string";
                    }
                } else {
                    options.returnErrorKey = self.returnErrorKey;
                }

                return operation(options);
            };
        });

        return api;
    }];
});
