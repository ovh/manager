export default /* @ngInject */ ($scope, $stateParams, $translate, Cdn) => {
  $scope.backends = null;

  $scope.domain = {};
  $scope.newBackend = {};

  $scope.isSecondStepValid = function isSecondStepValid() {
    return (
      $scope.domain.backend ||
      ($scope.newBackend.value && !$scope.maxBackendsReached())
    );
  };

  $scope.loadBackends = function loadBackends() {
    if (!$scope.backends) {
      Cdn.getBackends($stateParams.productId).then((backends) => {
        $scope.backends = backends;
      });
    }
  };

  $scope.maxBackendsReached = function maxBackendsReached() {
    return (
      $scope.backends &&
      $scope.backends.backendsMax &&
      $scope.backends.backendsMax === $scope.backends.results.length
    );
  };

  // On newbackend change, reset select
  $scope.$watch(
    'newBackend.value',
    (backend) => {
      if (backend) {
        $scope.domain.backend = null;
      }
    },
    true,
  );

  // On select change, reset newBackend input
  $scope.$watch(
    'domain.backend',
    (backend) => {
      if (backend) {
        $scope.newBackend.value = null;
      }
    },
    true,
  );

  $scope.addDomain = function addDomain() {
    if ($scope.newBackend.value) {
      $scope.domain.backend = $scope.newBackend.value;
    }
    $scope.resetAction();
    Cdn.addDomain($stateParams.productId, $scope.domain).then(
      () => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_add_domain_success', {
            t0: $scope.domain.domain,
            t1: $scope.domain.backend,
          }),
          true,
        );
      },
      (data) => {
        $scope.setMessage(
          $translate.instant('cdn_configuration_add_domain_fail'),
          data,
        );
      },
    );
  };
};
