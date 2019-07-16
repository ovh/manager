angular.module('Module.emailpro.controllers').controller('EmailProDomainMxAutoconfigCtrl', ($scope, $stateParams, $translate, EmailPro, EmailProDomains, EMAILPRO_MX_CONFIG, constants) => {
  $scope.domain = $scope.currentActionData;

  $scope.init = function () {
    EmailProDomains.getDnsSettings($stateParams.productId, $scope.domain.name).then((data) => {
      $scope.domainDiag = data;

      if (constants.target === 'CA') {
        $scope.domainDiag.mx.spam = EMAILPRO_MX_CONFIG.CA.spam;
      } else if (constants.target === 'EU') {
        $scope.domainDiag.mx.spam = EMAILPRO_MX_CONFIG.EU.spam;
      }

      $scope.model = {
        antiSpam: true,
      };
    }, (failure) => {
      $scope.resetAction();
      $scope.setMessage($translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), failure);
    });
  };

  const prepareModel = function () {
    let data = [];
    if ($scope.model.antiSpam === true) {
      data = $scope.domainDiag.mx.spam;
    } else {
      data = $scope.domainDiag.mx.noSpam;
    }
    return {
      domain: $scope.domain.name,
      fieldList: data,
    };
  };

  $scope.configMX = function () {
    $scope.resetAction();

    EmailProDomains.addZoneDnsField($stateParams.productId, prepareModel()).then((success) => {
      if (success.state === 'OK') {
        $scope.setMessage($translate.instant('emailpro_tab_domain_diagnostic_add_field_success'), { status: 'done' });
      } else {
        $scope.setMessage($translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), { status: 'error' });
      }
    }, (failure) => {
      $scope.setMessage($translate.instant('emailpro_tab_domain_diagnostic_add_field_failure'), failure);
    });
  };
});
