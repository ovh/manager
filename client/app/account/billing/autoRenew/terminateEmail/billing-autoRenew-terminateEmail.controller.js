angular.module('Billing.controllers').controller('EmailTerminateCtrl', ($scope, $translate, BillingAutoRenew, Alerter, AUTORENEW_EVENT) => {
  $scope.email = _.first($scope.currentActionData);
  $scope.loaders = {
    loading: true,
  };

  BillingAutoRenew.getEmailInfos($scope.email.serviceId)
    .then((emailInfos) => {
      $scope.emailInfos = emailInfos;
      $scope.canTerminate = emailInfos.offer.indexOf('hosting') === -1;
    })
    .catch(() => {
      Alerter.success($translate.instant('autorenew_service_EMAIL_DOMAIN_terminate_success'));
      $scope.resetAction();
    })
    .finally(() => {
      $scope.loaders.loading = false;
    });

  $scope.terminate = () => {
    $scope.loaders.loading = true;
    BillingAutoRenew.terminateEmail($scope.email.serviceId)
      .then(
        () => {
          $scope.$emit(AUTORENEW_EVENT.TERMINATE, {
            serviceType: 'EMAIL_DOMAIN',
            serviceId: $scope.email.serviceId,
          });

          Alerter.success($translate.instant('autorenew_service_EMAIL_DOMAIN_terminate_success'));
        },
        (err) => {
          Alerter.alertFromSWS($translate.instant('autorenew_service_EMAIL_DOMAIN_terminate_error'), err);
        },
      )
      .finally(() => {
        $scope.loaders.loading = false;
        $scope.resetAction();
      });
  };
});
