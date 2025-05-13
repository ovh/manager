export default /* @ngInject */ (
  $scope,
  $translate,
  BillingVouchers,
  $stateParams,
  Alerter,
) => {
  $scope.movementIds = [];
  $scope.voucherAccountId = $stateParams.voucherAccountId;

  $scope.loaders = {
    movements: false,
  };

  function init() {
    $scope.getMovements();
  }

  $scope.getMovements = function getMovements(forceRefresh) {
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
        Alerter.alertFromSWS(
          $translate.instant('voucher_informations_error'),
          err,
        );
      },
    );
  };

  $scope.transformItem = function transformItem(item) {
    $scope.loaders.movements = true;
    return BillingVouchers.getMovement({
      id: $scope.voucherAccountId,
      movementId: item,
    });
  };

  $scope.onTransformItemDone = function onTransformItemDone() {
    $scope.loaders.movements = false;
  };

  init();
};
