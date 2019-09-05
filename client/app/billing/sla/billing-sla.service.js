angular.module('Billing.services').service('BillingSla', function (OvhHttp) {
  const cache = {
    slas: 'UNIVERS_BILLING_SLAS',
    sla: 'UNIVERS_BILLING_SLA',
  };

  this.getSlas = function (opts) {
    return OvhHttp.get('/me/sla', {
      rootPath: 'apiv6',
      cache: cache.slas,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getSla = function (opts) {
    return OvhHttp.get('/me/sla/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.sla,
    });
  };

  this.applySla = function (opts) {
    return OvhHttp.post('/me/sla/{id}/apply', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      clearAllCache: cache.sla,
    });
  };

  this.canBeApplied = function (opts) {
    return OvhHttp.get('/me/sla/{id}/canBeApplied', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };

  this.getServices = function (opts) {
    return OvhHttp.get('/me/sla/{id}/services', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };

  this.getStatus = function (opts) {
    return OvhHttp.get('/me/sla/{id}/status', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
    });
  };
});
