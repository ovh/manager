/**
 * @ngdoc controller
 * @name Billing.controllers.AutoRenew.activate
 * @description
 */
angular.module('Billing.controllers').controller('Billing.controllers.AutoRenew.activate', ($scope, $translate, BillingAutoRenew, Alerter) => {
  $scope.nicRenew = $scope.currentActionData.nicRenew;

  $scope.activeAutoRenew = function activeAutoRenew() {
    const { renewDay } = $scope.nicRenew;
    const active = true;
    const promise = !$scope.nicRenew.initialized
      ? BillingAutoRenew.enableAutorenew(renewDay)
      : BillingAutoRenew.putAutorenew({ active, renewDay });

    promise
      .then(() => {
        $scope.nicRenew.active = true;
        Alerter.success($translate.instant('autorenew_service_activate_success'));
      })
      .catch((error) => {
        $scope.nicRenew.error = error.statusText || error.message;
        Alerter.set('alert-danger', $scope.nicRenew.error);
      })
      .finally(() => {
        $scope.nicRenew.updateLoading = false;
        $scope.resetAction();
      });
  };
});
