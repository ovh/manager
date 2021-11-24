export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  Cdn,
  CdnDomain,
) => {
  $scope.backends = null;
  $scope.domain = null;

  $scope.currentBackend = null;
  $scope.existingBackend = {};
  $scope.newBackend = {};

  $scope.loadBackendData = function loadBackendData() {
    $scope.loadBackend();
    $scope.loadBackends();
  };

  $scope.loadBackend = function loadBackend() {
    CdnDomain.getSelected($stateParams.productId, $stateParams.domain).then(
      (data) => {
        $scope.currentBackend = data.backend.ipv4;
        $scope.domain = data;
      },
      (data) => {
        $scope.setMessage(
          $translate.instant('cdn_domain_configuration_change_backend_fail', {
            t0: $scope.domain.domain,
          }),
          data,
        );
      },
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
        $scope.existingBackend.value = null;
      }
    },
    true,
  );

  // On select change, reset newBackend input
  $scope.$watch(
    'existingBackend.value',
    (backend) => {
      if (backend) {
        $scope.newBackend.value = null;
      }
    },
    true,
  );

  $scope.buyDomains = function buyDomains() {
    $scope.setAction('../backend/order/cdn-dedicated-backend-order');
  };

  $scope.modifyBackend = function modifyBackend() {
    if ($scope.newBackend.value) {
      $scope.existingBackend.value = $scope.newBackend.value;
    }
    $scope.resetAction();
    CdnDomain.modifyBackend(
      $stateParams.productId,
      $stateParams.domain,
      $scope.existingBackend.value,
    )
      .then(() =>
        $scope.setMessage(
          $translate.instant(
            'cdn_domain_configuration_change_backend_success',
            { t0: $scope.domain.domain },
          ),
          true,
        ),
      )
      .catch((data) =>
        $scope.setMessage(
          $translate.instant('cdn_domain_configuration_change_backend_fail'),
          angular.extend(data, { type: 'ERROR' }),
        ),
      );
  };
};
