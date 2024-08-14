{
  const cache = {
    indys: 'UNIVERS_WEB_INDYS',
    indy: 'UNIVERS_WEB_INDY',
  };

  angular.module('services').service(
    'HostingIndy',
    class HostingIndy {
      /* @ngInject */
      constructor(OvhHttp) {
        this.OvhHttp = OvhHttp;
      }

      /**
       * Get Indys
       * @param {string} serviceName
       * @param {object} opts
       */
      getIndys(serviceName, opts = {}) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/indy`, {
          rootPath: 'apiv6',
          params: opts.params,
          cache: cache.indys,
          clearAllCache: opts.forceRefresh,
        });
      }

      /**
       * Get Indy
       * @param {string} serviceName
       * @param {object} opts
       */
      getIndy(serviceName, opts) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/indy/${opts.login}`,
          {
            rootPath: 'apiv6',
            cache: cache.indy,
          },
        );
      }
    },
  );
}
