import angular from 'angular';
import assign from 'lodash/assign';

export default function ovhAngularUserPrefProvider() {
  const self = this;
  const config = {
    apiv6Path: null,
    regex: null,
  };

  self.paramsInjector = function paramsInjector(str, params, prefix) {
    const notNullParams = params || {};
    return [prefix || '', str.replace(/\{([^}]+)\}/, (replacer, key) => encodeURIComponent(notNullParams[key] || ''))].join('/');
  };

  /**
   * Index of pending creation requests promises. Indexed by key.
   */
  const pendingCreationRequests = {};

  /**
   * @ngdoc function
   * @name setRegex
   * @methodOf ng-ovh-user-pref.ovhUserPrefProvider
   * @param {Regex} to check format of keys
   * @description
   * Configure the regex
   */
  self.setRegex = function setRegex(regex) {
    config.regex = regex;
  };

  function removeTrailingSlashes(path) {
    return path ? path.replace(/\/+$/g, '') : path;
  }

  /* Check the format of a key */
  function checkFormat(key) {
    return config.regex.test(key);
  }

  /**
   * @ngdoc function
   * @name setApiv6Path
   * @methodOf ng-ovh-user-pref.ovhUserPrefProvider
   * @param {String} apiv6Path Path to configure routes
   * @description
   * Configure the route of apiv6
   */
  self.setApiv6Path = function setApiv6Path(apiv6Path) {
    config.apiv6Path = removeTrailingSlashes(apiv6Path);
  };

  /**
   * @ngdoc service
   * @name ng-ovh-user-pref.ovhUserPref
   * @description
   * <p>Getter / setter for preferences</p>
   */
  self.$get = /* @ngInject */ function $get(ovhProxyRequest, $q, OVH_USER_PREF) {
    const ovhUserPrefService = {};
    config.apiv6Path = config.apiv6Path || removeTrailingSlashes(ovhProxyRequest.pathPrefix());

    // default : CATEGORY_TYPE (_DETAILS)*
    config.regex = config.regex || /^[A-Z]+_[A-Z][A-Z0-9]*(?:_[A-Z0-9]*)*$/;

    /**
     * @ngdoc function
     * @name getKeys
     * @methodOf ng-ovh-user-pref.ovhUserPref
     * @param {Object=} [opts=undefined] Special options to pass to the api
     * @return {Promise} Resource promise
     * @description
     * Get all setted keys for the user
     */
    ovhUserPrefService.getKeys = function getKeys(opts) {
      const options = assign(opts || {}, { serviceType: 'apiv6' });

      return ovhProxyRequest.get(
        self.paramsInjector(OVH_USER_PREF.path.get, null, config.apiv6Path),
        options,
      )
        .then((resp) => (resp ? resp.data : []));
    };

    /**
     * @ngdoc function
     * @name getValue
     * @methodOf ng-ovh-user-pref.ovhUserPref
     * @param {String}  key              Key to read
     * @param {Object=} [opts=undefined] Special options to pass to the api
     * @return {Promise} Resource promise
     * @description
     * Get value of user preference
     */
    ovhUserPrefService.getValue = function getValue(key, opts) {
      const options = assign(opts || {}, { serviceType: 'apiv6' });

      return ovhProxyRequest.get(self.paramsInjector(
        OVH_USER_PREF.path.getKey,
        { key },
        config.apiv6Path,
      ), options)
        .then((resp) => {
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
     * @methodOf ng-ovh-user-pref.ovhUserPref
     * @param {String} key      Key of the preference to create
     * @param {Object} newValue Value to assign
     * @return {Promise} Resource promise
     * @description
     * Create/overide value of an user preference
     */
    ovhUserPrefService.create = function create(key, value) {
      if (!checkFormat(key)) {
        return $q.reject('Invalid format key');
      }

      const createCanceller = $q.defer();

      if (key in pendingCreationRequests) {
        pendingCreationRequests[key].resolve(); // cancel previous request
      }
      pendingCreationRequests[key] = createCanceller; // set new canceller

      return ovhProxyRequest.post(
        self.paramsInjector(OVH_USER_PREF.path.create, null, config.apiv6Path),
        {
          key,
          value: angular.toJson(value),
        },
        {
          serviceType: 'apiv6',
          timeout: createCanceller.promise,
        },
      ).then((resp) => (resp ? resp.data : resp))
        .finally(() => {
          if (pendingCreationRequests[key] === createCanceller) {
            delete pendingCreationRequests[key]; // create done, remove pending canceller
          }
        });
    };

    /**
     * @ngdoc function
     * @name assign
     * @methodOf ng-ovh-user-pref.ovhUserPref
     * @param {String} key      Key of the preference
     * @param {Object} newValue Value to assign
     * @return {Promise} Resource promise
     * @description
     * Merge/extend value of an user preference
     */
    ovhUserPrefService.assign = function assignFn(key, newValue) {
      if (!checkFormat(key)) {
        return $q.reject('Invalid format key');
      }

      return ovhUserPrefService.getValue(key)
        .then((value) => ovhProxyRequest.post(
          self.paramsInjector(OVH_USER_PREF.path.assign, null, config.apiv6Path),
          {
            key,
            value: angular.toJson(assign(value, newValue)),
          },
          {
            serviceType: 'apiv6',
          },
        ), (err) => {
          // if key is not found, create it
          if (err && err.status === 404) {
            return ovhProxyRequest.post(
              self.paramsInjector(OVH_USER_PREF.path.create, null, config.apiv6Path),
              {
                key,
                value: angular.toJson(newValue),
              },
              {
                serviceType: 'apiv6',
              },
            );
          }
          return $q.reject(err);
        })
        .then((resp) => (resp ? resp.data : resp));
    };


    /**
     * @ngdoc function
     * @name remove
     * @methodOf ng-ovh-user-pref.ovhUserPref
     * @param {String} key Key to delete
     * @return {Promise} Resource promise
     * @description
     * remove an user preference
     */
    ovhUserPrefService.remove = function remove(key) {
      if (!checkFormat(key)) {
        return $q.reject('Invalid format key');
      }

      if (key in pendingCreationRequests) {
        pendingCreationRequests[key].resolve(); // cancel previous creation request
        delete pendingCreationRequests[key]; // delete canceller reference
      }

      return ovhProxyRequest.delete(
        self.paramsInjector(
          OVH_USER_PREF.path.remove,
          { key },
          config.apiv6Path,
        ),
        {
          serviceType: 'apiv6',
        },
      ).then((resp) => (resp ? resp.data : resp));
    };

    return ovhUserPrefService;
  };
}
