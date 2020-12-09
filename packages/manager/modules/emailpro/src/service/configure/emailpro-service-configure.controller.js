import angular from 'angular';
import assign from 'lodash/assign';

export default /* @ngInject */ function (
  $scope,
  $translate,
  APIEmailPro,
  EmailPro,
) {
  const { exchange } = $scope.currentActionData;

  $scope.loaders = {
    details: true,
    put: false,
  };

  function getDetails() {
    return APIEmailPro.get('/{exchangeService}', {
      urlParams: {
        exchangeService: exchange.domain,
      },
    }).then(
      (serviceDescription) => {
        $scope.service = serviceDescription;
        $scope.service.lockoutThreshold = angular.isNumber(
          $scope.service.lockoutThreshold,
        )
          ? $scope.service.lockoutThreshold
          : 0;

        $scope.service.minPasswordLength = angular.isNumber(
          $scope.service.minPasswordLength,
        )
          ? $scope.service.minPasswordLength
          : 0;
        $scope.service.minPasswordAge = angular.isNumber(
          $scope.service.minPasswordAge,
        )
          ? $scope.service.minPasswordAge
          : 0;
        $scope.service.maxPasswordAge = angular.isNumber(
          $scope.service.maxPasswordAge,
        )
          ? $scope.service.maxPasswordAge
          : 0;
        $scope.loaders.details = false;
        return $scope.service;
      },
      () => {
        $scope.loaders.details = false;
      },
    );
  }

  $scope.service = {};

  $scope.formIsValid = {
    value: true,
  };

  $scope.putDetails = function putDetails() {
    $scope.loaders.put = true;

    const dataToSend = {
      complexityEnabled: $scope.service.complexityEnabled,
      lockoutThreshold: $scope.service.lockoutThreshold || null,
      maxPasswordAge: $scope.service.maxPasswordAge || null,
      minPasswordAge: $scope.service.minPasswordAge || null,
      minPasswordLength: $scope.service.minPasswordLength || null,
    };

    if ($scope.service.lockoutThreshold > 0) {
      dataToSend.lockoutDuration = $scope.service.lockoutDuration;
      dataToSend.lockoutObservationWindow =
        $scope.service.lockoutObservationWindow;
    }

    return APIEmailPro.put('/{exchangeService}', {
      urlParams: {
        exchangeService: exchange.domain,
      },
      data: dataToSend,
    }).then(
      () => {
        $scope.resetAction();
        EmailPro.resetAccounts();
        $scope.loaders.put = false;
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_configure_success'),
          { status: 'success' },
        );
      },
      (reason) => {
        $scope.resetAction();
        $scope.loaders.put = false;
        assign(reason.data, { type: 'ERROR' });
        $scope.setMessage(
          $translate.instant('emailpro_ACTION_configure_error'),
          reason.data,
        );
      },
    );
  };

  getDetails();
}
