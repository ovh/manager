angular.module('Billing.controllers').controller('Billing.controllers.Vouchers.Movements', ($scope, $translate, BillingVouchers, $stateParams, Alerter) => {
  $scope.movementIds = [];
  $scope.voucherAccountId = $stateParams.voucherAccountId;

  $scope.loaders = {
    movements: false,
  };

  function init() {
    $scope.getMovements();
  }

  $scope.getMovements = function (forceRefresh) {
    $scope.movementIds = [];
    $scope.loaders.movements = true;
    return BillingVouchers.getMovements({
      id: $scope.voucherAccountId,
      forceRefresh,
    }).then(
      (ids) => {
        $scope.movementIds = ids;
        if (ids.length === 0) {
          $scope.loaders.movements = false;
        }
      },
      (err) => {
        $scope.loaders.movements = false;
        Alerter.alertFromSWS($translate.instant('voucher_informations_error'), err);
      },
    );
  };

  $scope.transformItem = function (item) {
    $scope.loaders.movements = true;
    return BillingVouchers.getMovement({
      id: $scope.voucherAccountId,
      movementId: item,
    });
  };

  $scope.onTransformItemDone = function () {
    $scope.loaders.movements = false;
  };

  init();
});
