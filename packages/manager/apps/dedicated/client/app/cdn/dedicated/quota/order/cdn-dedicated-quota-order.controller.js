export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  cdnDedicatedOrderQuota,
) => {
  $scope.orderInformations = null;
  $scope.choices = {
    count: null,
    duration: null,
    order: null,
  };

  $scope.contractsValidated = {
    value: false,
  };

  $scope.$watch('choices.count', () => {
    angular.forEach($scope.orderInformations, (value) => {
      if (value.quantity === +$scope.choices.count) {
        $scope.choices.duration = value.duration.duration;
        $scope.choices.order = value;
      }
    });
  });

  $scope.loadQuotaInformations = () => {
    cdnDedicatedOrderQuota
      .getOrderQuotaInformations($stateParams.productId)
      .then((data) => {
        $scope.orderInformations = data.results;
      })
      .catch(() => {
        $scope.resetAction();
        $scope.setMessage(
          $translate.instant('cdn_configuration_order_quota_step1_fail'),
          { type: 'ERROR' },
        );
      });
  };

  $scope.orderQuota = () => {
    cdnDedicatedOrderQuota
      .orderQuota(
        $stateParams.productId,
        $scope.choices.count,
        $scope.choices.duration,
      )
      .then((order) => {
        $scope.url = order.url;
      })
      .catch(() => {
        $scope.resetAction();
        $scope.setMessage(
          $translate.instant('cdn_configuration_order_quota_step3_fail'),
          { type: 'ERROR' },
        );
      });
  };

  $scope.displayOrder = () => {
    $scope.resetAction();
    window.open($scope.url, '_blank');
  };
};
