angular.module('Billing.controllers').controller('Billing.controllers.OrderRetractionCtrl', function ($log, $scope, $state, $stateParams, $translate, Alerter, BillingOrders) {
  $scope.orderId = $stateParams.id;

  this.$state = $state;

  this.retract = function () {
    $scope.success = false;

    BillingOrders.retractOrder($scope.orderId)
      .then(() => {
        $scope.success = true;
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('orders_retract_error'), err);
        $log.error(err);
      });
  };
});
