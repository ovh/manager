angular.module('services').service(
  'Domains',
  class Domains {
    /* @ngInject */
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    /**
     * Get domains list
     * @param count
     * @param offset
     * @param search
     */
    getDomains(count, offset, search) {
      return this.OvhHttp.get('/sws/domains', {
        rootPath: '2api',
        params: {
          count,
          offset,
          search: search || null,
        },
      });
    }
  },
);
