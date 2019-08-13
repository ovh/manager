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

      if (!_(filters).isArray()) {
        filtersAsArray = [filters];
      }

      const promises = filtersAsArray.map(filter => this.OvhHttp.get(`/hosting/web/${serviceName}/envVar`, {
        rootPath: 'apiv6',
        params: filter,
      }));

      return this.$q.allSettled(promises).then((data) => {
        let dataAsArray = data;

        if (!_(data).isArray()) {
          dataAsArray = [data];
        }

        return _(dataAsArray)
          .chain()
          .map(datum => (_(datum).isArray
            ? _(datum)
              .flatten()
              .value()
            : datum)) // The API returns an array of array sometimes
          .flatten()
          .uniq()
          .value();
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
