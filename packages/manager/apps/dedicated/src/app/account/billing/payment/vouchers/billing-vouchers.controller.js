angular.module('Billing.controllers').controller('Billing.controllers.Vouchers', ($scope, $translate, BillingVouchers, Alerter) => {
  $scope.voucherIds = [];

  $scope.loaders = {
    vouchers: false,
    creditCode: false,
  };

  $scope.creditCode = null;

  function init() {
    $scope.getVouchers();
  }

  $scope.getVouchers = function (forceRefresh) {
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
        Alerter.alertFromSWS($translate.instant('voucher_informations_error'), err);
      },
    );
  };

  $scope.transformItem = function (item) {
    $scope.loaders.vouchers = true;
    return BillingVouchers.getVoucher({ id: item });
  };

  $scope.onTransformItemDone = function () {
    $scope.loaders.vouchers = false;
  };

  init();
});
