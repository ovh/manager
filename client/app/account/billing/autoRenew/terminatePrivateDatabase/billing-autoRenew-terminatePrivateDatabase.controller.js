angular.module('Billing.controllers').controller('PrivateDatabaseTerminateCtrl', ($scope, $log, $translate, BillingAutoRenew, Alerter, AUTORENEW_EVENT) => {
  $scope.privateDatabase = _.first($scope.currentActionData);
  $scope.loaders = {
    loading: false,
  };

  $scope.terminate = () => {
    $scope.loaders.loading = true;
    return BillingAutoRenew.terminateHostingPrivateDatabase($scope.privateDatabase.serviceId)
      .then(() => {
        $scope.$emit(AUTORENEW_EVENT.TERMINATE, {
          serviceType: 'HOSTING_PRIVATE_DATABASE',
          serviceId: $scope.privateDatabase.serviceId,
        });
        Alerter.success($translate.instant('privateDatabase_dashboard_close_service_success'));
      })
      .catch((err) => {
        Alerter.alertFromSWS($translate.instant('privateDatabase_dashboard_close_service_error'), err);
        $log.error(err);
      })
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
