angular.module('Billing.services').service('BillingVouchers', function (OvhHttp) {
  const cache = {
    vouchers: 'UNIVERS_BILLING_VOUCHERS',
    voucher: 'UNIVERS_BILLING_VOUCHER',
    movements: 'UNIVERS_BILLING_VOUCHER_MOVEMENTS',
    movement: 'UNIVERS_BILLING_VOUCHER_MOVEMENT',
  };

  this.getVouchers = function (opts) {
    return OvhHttp.get('/me/voucherAccount', {
      rootPath: 'apiv6',
      cache: cache.vouchers,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getVoucher = function (opts) {
    return OvhHttp.get('/me/voucherAccount/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.voucher,
    });
  };

  this.getMovements = function (opts) {
    return OvhHttp.get('/me/voucherAccount/{id}/movements', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.movements,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getMovement = function (opts) {
    return OvhHttp.get('/me/voucherAccount/{id}/movements/{movementId}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
        movementId: opts.movementId,
      },
      cache: cache.movement,
    });
  };
});
