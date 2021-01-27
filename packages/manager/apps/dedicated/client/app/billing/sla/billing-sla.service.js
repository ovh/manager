export default /* @ngInject */ function BillingSla(OvhHttp) {
  const cache = {
    slas: 'UNIVERS_BILLING_SLAS',
    sla: 'UNIVERS_BILLING_SLA',
  };

  this.getSlas = function getSlas(opts) {
    return OvhHttp.get('/me/sla', {
      rootPath: 'apiv6',
      cache: cache.slas,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getSla = function getSla(opts) {
    return OvhHttp.get('/me/sla/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.sla,
    });
  };

  this.applySla = function applySla(opts) {
    return OvhHttp.post('/me/sla/{id}/apply', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      clearAllCache: cache.sla,
    });
  };

  this.canBeApplied = function canBeApplied(opts) {
    return OvhHttp.get('/me/sla/{id}/canBeApplied', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };

  this.getServices = function getServices(opts) {
    return OvhHttp.get('/me/sla/{id}/services', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };

  this.getStatus = function getStatus(opts) {
    return OvhHttp.get('/me/sla/{id}/status', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };
}
