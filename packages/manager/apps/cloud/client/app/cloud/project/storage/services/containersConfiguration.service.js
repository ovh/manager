import assignIn from 'lodash/assignIn';

angular.module('managerApp').service('CloudStorageContainersConfiguration', [
  '$cacheFactory',
  '$parse',
  function CloudStorageContainersConfigurationService($cacheFactory, $parse) {
    const self = this;

    function Cache(ngCache) {
      this.cache = ngCache;
    }

    self.containerMetaCache = new Cache(
      $cacheFactory('storageContainerMetaCache'),
    );
    self.accessCache = $cacheFactory('storageAccessCache');

    function getKey(projectId, containerId) {
      return `${projectId}_${containerId}`;
    }

    assignIn(Cache.prototype, {
      /**
       * Set container meta data cache value.
       * @param {string} projectId   project id
       * @param {string} containerId container id
       * @param {Object} data        data to save
       * @return {Object} cache object
       */
      set(projectId, containerId, data) {
        this.cache.put(getKey(projectId, containerId), data);
        return this;
      },

      /**
       * Update container meta data cache value.
       * @param {string}        projectId      project id
       * @param {string}        containerId    container id
       * @param {string|Object} property|data  property name|data to save
       * @param {Object}        data           data to save (optional)
       * @return {Object} cache object
       */
      update(projectId, containerId, property, data) {
        const key = getKey(projectId, containerId);
        const dataToSave = this.cache.get(key) || {};

        /* eslint-disable prefer-rest-params, no-param-reassign */
        if (!arguments[3]) {
          data = property;
          property = null;
        }
        /* eslint-enable prefer-rest-params, no-param-reassign */

        if (property) {
          const setter = $parse(property).assign;
          setter(dataToSave, data);
        } else {
          angular.merge(dataToSave, data);
        }

        this.set(projectId, containerId, dataToSave);
        return this;
      },

      /**
       * Get container meta data cache value.
       * @param {string} projectId    project id
       * @param {string} containerId  container id
       * @param {string} property     property name (optional)
       * @return {Object}             data to get
       */
      get(projectId, containerId, property) {
        const key = getKey(projectId, containerId);
        const data = this.cache.get(key);
        if (property) {
          const getter = $parse(property);
          return getter(data);
        }
        return data;
      },

      /**
       * Remove container meta data cache value.
       * @param {string} projectId    project id
       * @param {string} containerId  container id
       * @return {Object} cache object
       */
      remove(projectId, containerId) {
        const key = getKey(projectId, containerId);
        this.cache.remove(key);
        return this;
      },
    });
  },
]);
