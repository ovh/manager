angular.module('services').service(
  'DomainsDnsSec',
  class DomainsDnsSec {
    /* @ngInject */
    constructor(OvhHttp) {
      this.OvhHttp = OvhHttp;
    }

    /**
     * Update DNSSEC state
     * @param newState
     * @param domains
     */
    updateDnssecState(newState, domains) {
      return this.OvhHttp.put('/sws/domains/dnssec', {
        rootPath: '2api',
        data: {
          domains,
          newState,
        },
        broadcast: 'domains.list.refresh',
      });
    }
  },
);
