import angular from 'angular';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  atInternet,
  EmailPro,
) => {
  const getModel = function getModel(exchange) {
    const model = {
      exchangeType: exchange.offer,
      automatic: exchange.renewType.automatic,
      deleteAtExpiration: !exchange.renewType.deleteAtExpiration, // switch the actual value
      renewPeriod: exchange.renewPeriod,
    };
    return model;
  };

  $scope.exchange = angular.copy($scope.currentActionData);
  $scope.exchange.renewPeriod = 'YEARLY';
  $scope.accountTypeHosted = EmailPro.accountTypeHosted;
  $scope.EmailPro2013Code = EmailPro.EmailPro2013Code;

  $scope.getSubmitButtonLabel = function getSubmitButtonLabel() {
    return $scope.exchange.deleteAtExpirationValue
      ? $translate.instant('emailpro_resilitation_action_button')
      : $translate.instant('emailpro_resilitation_cancel_action_button');
  };

  $scope.submit = function submit() {
    atInternet.trackClick({
      name: 'web::email-pro::delete::confirm',
      type: 'action',
    });
    EmailPro.updateDeleteAtExpiration(
      $stateParams.productId,
      getModel($scope.exchange),
    )
      .then((success) => {
        let updateRenewMessages;

        if ($scope.exchange.renewType.deleteAtExpiration) {
          updateRenewMessages = {
            OK: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_cancel_action_success`,
            ),
            PARTIAL: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_cancel_action_partial`,
            ),
            ERROR: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_cancel_action_failure`,
            ),
          };
        } else {
          updateRenewMessages = {
            OK: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_action_success`,
            ),
            PARTIAL: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_action_partial`,
            ),
            ERROR: $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_action_failure`,
            ),
          };
        }
        $scope.setMessage(updateRenewMessages, success);
        $scope.resetAction();
      })
      .catch((failure) => {
        if ($scope.exchange.renewType.deleteAtExpiration) {
          $scope.setMessage(
            $translate.instant(
              `${$scope.exchange.billingPlan}_resilitation_cancel_action_failure`,
            ),
            failure.data,
          );
        } else {
          $scope.setMessage(
            $translate.instant(
              `${$scope.exchange.billingPlan}__resilitation_action_failure`,
            ),
            failure.data,
          );
        }
        $scope.resetAction();
      });
  };
};
