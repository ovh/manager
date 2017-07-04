/**
 * @ngdoc object
 * @name ovh-angular-user-pref.ovhUserPrefProvider
 * @description
 * provider in the ovh-angular-user-pref.
 */
angular.module("ovh-angular-user-pref").provider("ovhUserPref", function () {
    "use strict";
    var self = this;
    var config = {
        apiv6Path: null,
        regex: null
    };

    self.paramsInjector = function (str, params, prefix) {
        var notNullParams = params || {};
        return [prefix || "", str.replace(/\{([^\}]+)\}/, function (replacer, key) {
            return encodeURIComponent(notNullParams[key] || "");
        })].join("/");
    };

    /**
     * Index of pending creation requests promises. Indexed by key.
     */
    var pendingCreationRequests = {};

    /**
     * @ngdoc function
     * @name setRegex
     * @methodOf ovh-angular-user-pref.ovhUserPrefProvider
     * @param {Regex} to check format of keys
     * @description
     * Configure the regex
     */
    self.setRegex = function (regex) {
        config.regex = regex;
    };

    function removeTrailingSlashes (path) {
        return path ? path.replace(/\/+$/g, "") : path;
    }

    /* Check the format of a key */
    function checkFormat (key) {
        return config.regex.test(key);
    }

    /**
     * @ngdoc function
     * @name setApiv6Path
     * @methodOf ovh-angular-user-pref.ovhUserPrefProvider
     * @param {String} apiv6Path Path to configure routes
     * @description
     * Configure the route of apiv6
     */
    self.setApiv6Path = function (apiv6Path) {
        config.apiv6Path = removeTrailingSlashes(apiv6Path);
    };

    /**
    * @ngdoc service
    * @name ovh-angular-user-pref.ovhUserPref
    * @description
    * <p>Getter / setter for preferences</p>
    */
    self.$get = ["ovh-proxy-request.proxy", "$q", "OVH_USER_PREF", function (api, $q, OVH_USER_PREF) {
        var ovhUserPrefService = {};
        config.apiv6Path = config.apiv6Path || removeTrailingSlashes(api.pathPrefix());

        // default : CATEGORY_TYPE (_DETAILS)*
        config.regex = config.regex || /^[A-Z]+_[A-Z][A-Z0-9]*(?:_[A-Z0-9]*)*$/;

        /**
         * @ngdoc function
         * @name getKeys
         * @methodOf ovh-angular-user-pref.ovhUserPref
         * @param {Object=} [opts=undefined] Special options to pass to the api
         * @return {Promise} Resource promise
         * @description
         * Get all setted keys for the user
         */
        ovhUserPrefService.getKeys = function (opts) {
            var options = _.assign(opts || {}, { serviceType: "apiv6" });

            return api.get(self.paramsInjector(OVH_USER_PREF.path.get, null, config.apiv6Path), options)
                .then(function (resp) {
                    return resp ? resp.data : [];
                });

        };

        /**
         * @ngdoc function
         * @name getValue
         * @methodOf ovh-angular-user-pref.ovhUserPref
         * @param {String}  key              Key to read
         * @param {Object=} [opts=undefined] Special options to pass to the api
         * @return {Promise} Resource promise
         * @description
         * Get value of user preference
         */
        ovhUserPrefService.getValue = function (key, opts) {
            var options = _.assign(opts || {}, { serviceType: "apiv6" });

            return api.get(self.paramsInjector(OVH_USER_PREF.path.getKey, { key: key }, config.apiv6Path), options)
                .then(function (resp) {
                    try {
                        return angular.fromJson(resp.data.value);
                    } catch (err) {
                        // value is not a valid JSON :( it must be corrupted
                        // consider the value doesnt exist so we can override it later
                        return $q.reject({ status: 404 });
                    }
                });
        };

        /**
         * @ngdoc function
         * @name create
         * @methodOf ovh-angular-user-pref.ovhUserPref
         * @param {String} key      Key of the preference to create
         * @param {Object} newValue Value to assign
         * @return {Promise} Resource promise
         * @description
         * Create/overide value of an user preference
         */
        ovhUserPrefService.create = function (key, value) {

            if (!checkFormat(key)) {
                return $q.reject("Invalid format key");
            }

            var createCanceller = $q.defer();

            if (key in pendingCreationRequests) {
                pendingCreationRequests[key].resolve(); // cancel previous request
            }
            pendingCreationRequests[key] = createCanceller; // set new canceller

            return api.post(self.paramsInjector(OVH_USER_PREF.path.create, null, config.apiv6Path), {
                key: key,
                value: angular.toJson(value)
            }, {
                serviceType: "apiv6",
                timeout: createCanceller.promise
            })
                .then(function (resp) {
                    return resp ? resp.data : resp;
                }).finally(function () {
                    if (pendingCreationRequests[key] === createCanceller) {
                        delete pendingCreationRequests[key]; // create done, remove pending canceller
                    }
                });
        };

        /**
         * @ngdoc function
         * @name assign
         * @methodOf ovh-angular-user-pref.ovhUserPref
         * @param {String} key      Key of the preference
         * @param {Object} newValue Value to assign
         * @return {Promise} Resource promise
         * @description
         * Merge/extend value of an user preference
         */
        ovhUserPrefService.assign = function (key, newValue) {
            if (!checkFormat(key)) {
                return $q.reject("Invalid format key");
            }

            return ovhUserPrefService.getValue(key)
                .then(function (value) {
                    return api.post(self.paramsInjector(OVH_USER_PREF.path.assign, null, config.apiv6Path), {
                        key: key,
                        value: angular.toJson(_.assign(value, newValue))
                    }, {
                        serviceType: "apiv6"
                    });
                }, function (err) {
                    // if key is not found, create it
                    if (err && err.status === 404) {
                        return api.post(self.paramsInjector(OVH_USER_PREF.path.create, null, config.apiv6Path), {
                            key: key,
                            value: angular.toJson(newValue)
                        }, {
                            serviceType: "apiv6"
                        });
                    }
                    return $q.reject(err);
                })
                .then(function (resp) {
                    return resp ? resp.data : resp;
                });
        };


        /**
         * @ngdoc function
         * @name remove
         * @methodOf ovh-angular-user-pref.ovhUserPref
         * @param {String} key Key to delete
         * @return {Promise} Resource promise
         * @description
         * remove an user preference
         */
        ovhUserPrefService.remove = function (key) {

            if (!checkFormat(key)) {
                return $q.reject("Invalid format key");
            }

            if (key in pendingCreationRequests) {
                pendingCreationRequests[key].resolve(); // cancel previous creation request
                delete pendingCreationRequests[key]; // delete canceller reference
            }

            return api.delete(self.paramsInjector(OVH_USER_PREF.path.remove, { key: key }, config.apiv6Path), {
                serviceType: "apiv6"
            })
                .then(function (resp) {
                    return resp ? resp.data : resp;
                });
        };

        return ovhUserPrefService;
    }];

});
