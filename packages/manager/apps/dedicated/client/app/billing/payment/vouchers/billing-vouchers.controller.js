export default /* @ngInject */ (
  $scope,
  $translate,
  BillingVouchers,
  Alerter,
) => {
  $scope.voucherIds = [];

  $scope.loaders = {
    vouchers: false,
    creditCode: false,
  };

  $scope.creditCode = null;

  function init() {
    $scope.getVouchers();
  }

  $scope.getVouchers = function getVouchers(forceRefresh) {
    $scope.voucherIds = [];
    $scope.loaders.vouchers = true;
    return BillingVouchers.getVouchers({ forceRefresh }).then(
      (ids) => {
        $scope.voucherIds = ids;
        if (ids.length === 0) {
          $scope.loaders.vouchers = false;
        }
      },
      (err) => {
        Alerter.alertFromSWS(
          $translate.instant('voucher_informations_error'),
          err,
        );
      },
    );
  };

  $scope.transformItem = function transformItem(item) {
    $scope.loaders.vouchers = true;
    return BillingVouchers.getVoucher({ id: item });
  };

  $scope.onTransformItemDone = function onTransformItemDone() {
    $scope.loaders.vouchers = false;
  };

  init();
};
