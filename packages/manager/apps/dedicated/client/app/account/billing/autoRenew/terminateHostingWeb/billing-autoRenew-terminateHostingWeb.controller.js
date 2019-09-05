import head from 'lodash/head';

angular.module('Billing.controllers').controller('HostingTerminateCtrl', ($scope, $log, $translate, constants, BillingAutoRenew, Alerter, AUTORENEW_EVENT) => {
  $scope.hosting = head($scope.currentActionData);
  $scope.loaders = {
    loading: false,
  };

  $scope.terminate = () => {
    $scope.loaders.loading = true;
    return BillingAutoRenew.terminateHosting($scope.hosting.serviceId)
      .then(() => {
        $scope.$emit(AUTORENEW_EVENT.TERMINATE, {
          serviceType: 'HOSTING_WEB',
          serviceId: $scope.hosting.serviceId,
        });
        Alerter.success($translate.instant('hosting_dashboard_close_service_success'));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('hosting_dashboard_close_service_error'), err);
        $log.error(err);
      })
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
