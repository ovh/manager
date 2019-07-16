angular.module('Module.emailpro.controllers').controller('EmailProRemoveDomainCtrl', ($scope, $stateParams, $translate, EmailProDomains) => {
  $scope.domain = $scope.currentActionData;
  $scope.submit = function () {
    $scope.resetAction();
    EmailProDomains.removeDomain($stateParams.productId, $scope.domain.name)
      .then(() => {
        $scope.setMessage($translate.instant('emailpro_tab_domain_remove_success'), { status: 'success' });
      }, (failure) => {
        $scope.setMessage($translate.instant('emailpro_tab_domain_remove_failure'), {
          code: null,
          id: $scope.domain.name,
          message: failure.message,
          type: 'ERROR',
        });
      });
  };
});
