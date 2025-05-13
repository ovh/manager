angular.module('services').service(
  'HostingFtp',
  class HostingFtp {
    /* @ngInject */
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    /**
     * Get hosting models
     */
    getModels() {
      return this.OvhHttp.get('/hosting/web.json', {
        rootPath: 'apiv6',
        cache: 'HOSTING_MODELS',
      });
    }

    restoreSnapshot(serviceName, data) {
      return this.OvhHttp.post(`/hosting/web/${serviceName}/restoreSnapshot`, {
        rootPath: 'apiv6',
        data,
      });
    }
  },
);
