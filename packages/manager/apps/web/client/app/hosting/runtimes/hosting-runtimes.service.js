import head from 'lodash/head';
import lodashFilter from 'lodash/filter';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

angular.module('services').service(
  'HostingRuntimes',
  class HostingRuntimes {
    /* @ngInject */
    constructor($q, OvhHttp, Hosting) {
      this.$q = $q;

      this.OvhHttp = OvhHttp;
      this.Hosting = Hosting;
    }

    /**
     * List all runtime configurations on hosting
     * @param serviceName
     * @param filters
     */
    list(serviceName, filters) {
      const promises = [];

      if (angular.isArray(filters)) {
        filters.forEach((filter) => {
          promises.push(
            this.OvhHttp.get(`/hosting/web/${serviceName}/runtime`, {
              rootPath: 'apiv6',
              params: filter,
            }),
          );
        });
      } else {
        promises.push(
          this.OvhHttp.get(`/hosting/web/${serviceName}/runtime`, {
            rootPath: 'apiv6',
          }),
        );
      }

      return this.$q.allSettled(promises).then(
        (data) => {
          let result = [];
          data.forEach((res) => {
            result = result.concat(res);
          });

          return uniq(result);
        },

        (err) => this.$q.reject(err),
      );
    }

    /**
     * Get runtime configuration informations
     * @param serviceName
     * @param id
     */
    get(serviceName, id) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/runtime/${id}`, {
        rootPath: 'apiv6',
      });
    }

    /**
     * Get default runtime
     * @param serviceName
     */
    getDefault(serviceName) {
      return this.list(serviceName)
        .then((runtimeIds) =>
          this.$q.all(
            map(runtimeIds, (runtimeId) => this.get(serviceName, runtimeId)),
          ),
        )
        .then((runtimes) =>
          head(lodashFilter(runtimes, (runtime) => runtime.isDefault)),
        );
    }

    /**
     * Get runtime attached domains
     * @param serviceName
     * @param id
     */
    getAttachedDomains(serviceName, id) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/runtime/${id}/attachedDomains`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * Get runtime available backend types
     * @param {string} serviceName
     */
    getAvailableTypes(serviceName) {
      return this.OvhHttp.get(
        `/hosting/web/${serviceName}/runtimeAvailableTypes`,
        {
          rootPath: 'apiv6',
        },
      );
    }

    /**
     * Create a runtime configuration on hosting
     * @param serviceName
     * @param name
     * @param type
     * @param publicDir
     * @param appEnv
     * @param appBootstrap
     */
    create(serviceName, { name, type, publicDir, appEnv, appBootstrap }) {
      return this.OvhHttp.post(`/hosting/web/${serviceName}/runtime`, {
        rootPath: 'apiv6',
        data: {
          name,
          type,
          publicDir,
          appEnv,
          appBootstrap,
        },
      }).then(
        (data) => {
          this.Hosting.resetRuntimes();

          return data;
        },

        (http) => this.$q.reject(http),
      );
    }

    /**
     * Update a runtime configuration on hosting
     * @param serviceName
     * @param id
     * @param name
     * @param type
     * @param publicDir
     * @param appEnv
     * @param appBootstrap
     */
    edit(serviceName, id, { name, type, publicDir, appEnv, appBootstrap }) {
      return this.OvhHttp.put(`/hosting/web/${serviceName}/runtime/${id}`, {
        rootPath: 'apiv6',
        data: {
          name,
          type,
          publicDir,
          appEnv,
          appBootstrap,
        },
      }).then((data) => {
        this.Hosting.resetRuntimes();

        return data;
      });
    }

    /**
     * Delete a runtime configuration on hosting
     * @param serviceName
     * @param id
     */
    delete(serviceName, id) {
      return this.OvhHttp.delete(`/hosting/web/${serviceName}/runtime/${id}`, {
        rootPath: 'apiv6',
      }).then(
        (data) => {
          this.Hosting.resetRuntimes();

          return data;
        },

        (http) => this.$q.reject(http),
      );
    }

    /**
     * Set a runtime configuration to default on hosting
     * @param serviceName
     * @param model
     * @param id
     */
    setDefault(serviceName, id) {
      return this.OvhHttp.put(`/hosting/web/${serviceName}/runtime/${id}`, {
        rootPath: 'apiv6',
        data: {
          isDefault: true,
        },
      }).then(
        (data) => {
          this.Hosting.resetRuntimes();

          return data;
        },

        (http) => this.$q.reject(http),
      );
    }
  },
);
