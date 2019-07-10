{
  const cache = {
    freedoms: 'UNIVERS_WEB_FREEDOMS',
    freedom: 'UNIVERS_WEB_FREEDOM',
    models: 'UNIVERS_WEB_FREEDOM_MODELS',
  };

  angular.module('services').service(
    'HostingFreedom',
    class HostingFreedom {
      /**
       * Constructor
       * @param OvhHttp
       */
      constructor(OvhHttp) {
        this.OvhHttp = OvhHttp;
      }

      /**
       * Get Freedoms
       * @param {string} serviceName
       * @param {object} opts
       */
      getFreedoms(serviceName, opts = {}) {
        return this.OvhHttp.get(`/hosting/web/${serviceName}/freedom`, {
          rootPath: 'apiv6',
          params: opts.params,
          cache: cache.freedoms,
          clearAllCache: opts.forceRefresh,
        });
      }

      /**
       * Get Freedom
       * @param {string} serviceName
       * @param {object} opts
       */
      getFreedom(serviceName, opts) {
        return this.OvhHttp.get(
          `/hosting/web/${serviceName}/freedom/${opts.domain}`,
          {
            rootPath: 'apiv6',
            cache: cache.freedom,
          },
        );
      }

      /**
       * Delete Freedom
       * @param {string} serviceName
       * @param {string} domain
       */
      deleteFreedom(serviceName, domain) {
        return this.OvhHttp.delete(
          `/hosting/web/${serviceName}/freedom/${domain}`,
          {
            rootPath: 'apiv6',
            clearAllCache: cache.freedom,
            broadcast: 'hosting.web.freedom.delete',
          },
        );
      }

      /**
       * Get Models
       */
      getModels() {
        return this.OvhHttp.get('/hosting/web.json', {
          rootPath: 'apiv6',
          cache: cache.models,
        });
      }
    },
  );
}
