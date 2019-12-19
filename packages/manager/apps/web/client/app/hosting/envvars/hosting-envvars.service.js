import flatten from 'lodash/flatten';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import uniq from 'lodash/uniq';

angular.module('services').service(
  'HostingEnvvars',
  class HostingEnvvars {
    constructor($q, Hosting, OvhHttp) {
      this.$q = $q;

      this.Hosting = Hosting;
      this.OvhHttp = OvhHttp;
    }

    /**
     * Get list of envvars on hosting
     * @param serviceName
     * @param filters
     */
    list(serviceName, filters) {
      let filtersAsArray = filters;

      if (!isArray(filters)) {
        filtersAsArray = [filters];
      }

      const promises = filtersAsArray.map((filter) => this.OvhHttp.get(`/hosting/web/${serviceName}/envVar`, {
        rootPath: 'apiv6',
        params: filter,
      }));

      return this.$q.allSettled(promises).then((data) => {
        let dataAsArray = data;

        if (!isArray(data)) {
          dataAsArray = [data];
        }

        return uniq(
          flatten(
            map(
              dataAsArray,
              (datum) => (isArray(datum) ? flatten(datum) : datum),
            ),
          ),
        );
      });
    }

    get(serviceName, key) {
      return this.OvhHttp.get(`/hosting/web/${serviceName}/envVar/${key}`, {
        rootPath: 'apiv6',
      });
    }

    create(serviceName, { key, type, value }) {
      return this.OvhHttp.post(`/hosting/web/${serviceName}/envVar`, {
        rootPath: 'apiv6',
        data: {
          key,
          type,
          value,
        },
      }).then((data) => {
        this.Hosting.resetEnvvars();

        return data;
      });
    }

    edit(serviceName, oldKey, { key, type, value }) {
      return this.OvhHttp.put(`/hosting/web/${serviceName}/envVar/${oldKey}`, {
        rootPath: 'apiv6',
        data: {
          key,
          type,
          value,
        },
      }).then((data) => {
        this.Hosting.resetEnvvars();

        return data;
      });
    }

    delete(serviceName, key) {
      return this.OvhHttp.delete(`/hosting/web/${serviceName}/envVar/${key}`, {
        rootPath: 'apiv6',
      }).then((data) => {
        this.Hosting.resetEnvvars();

        return data;
      });
    }
  },
);
