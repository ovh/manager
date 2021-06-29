export default /* @ngInject */ function BillingVouchers(OvhHttp) {
  const cache = {
    vouchers: 'UNIVERS_BILLING_VOUCHERS',
    voucher: 'UNIVERS_BILLING_VOUCHER',
    movements: 'UNIVERS_BILLING_VOUCHER_MOVEMENTS',
    movement: 'UNIVERS_BILLING_VOUCHER_MOVEMENT',
  };

  this.getVouchers = function getVouchers(opts) {
    return OvhHttp.get('/me/voucherAccount', {
      rootPath: 'apiv6',
      cache: cache.vouchers,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getVoucher = function getVoucher(opts) {
    return OvhHttp.get('/me/voucherAccount/{id}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.voucher,
    });
  };

  this.getMovements = function getMovements(opts) {
    return OvhHttp.get('/me/voucherAccount/{id}/movements', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
      },
      cache: cache.movements,
      clearAllCache: opts.forceRefresh,
    });
  };

  this.getMovement = function getMovement(opts) {
    return OvhHttp.get('/me/voucherAccount/{id}/movements/{movementId}', {
      rootPath: 'apiv6',
      urlParams: {
        id: opts.id,
        movementId: opts.movementId,
      },
      cache: cache.movement,
    });
  };
}
