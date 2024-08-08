angular.module('services').service(
  'HostingEnvvars',
  class HostingEnvvars {
    /* @ngInject */
    constructor($http, $q, Hosting, iceberg) {
      this.$http = $http;
      this.$q = $q;
      this.Hosting = Hosting;
      this.iceberg = iceberg;
    }

    /**
     * Get list of envvars on hosting
     * @param serviceName
     */
    list(serviceName) {
      return this.iceberg(`/hosting/web/${serviceName}/envVar`)
        .query()
        .expand('CachedObjectList-Pages')
        .execute()
        .$promise.then(({ data }) => data);
    }

    create(serviceName, { key, type, value }) {
      return this.$http
        .post(`/hosting/web/${serviceName}/envVar`, {
          key,
          type,
          value: value.toString(),
        })
        .then(() => this.Hosting.resetEnvvars());
    }

    edit(serviceName, key, value) {
      return this.$http
        .put(`/hosting/web/${serviceName}/envVar/${key}`, {
          value: value.toString(),
        })
        .then(() => this.Hosting.resetEnvvars());
    }

    delete(serviceName, key) {
      return this.$http
        .delete(`/hosting/web/${serviceName}/envVar/${key}`)
        .then(() => this.Hosting.resetEnvvars());
    }
  },
);
