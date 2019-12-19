import head from 'lodash/head';

angular.module('App').controller('BackendsAddCtrl', ($scope, $stateParams, $translate, Cdn) => {
  $scope.price = null;
  $scope.choices = {
    count: null,
    duration: null,
    order: null,
  };
  $scope.contractsValidated = {};

  $scope.loadBackendPrice = () => {
    if (!$scope.price) {
      Cdn.getSelected()
        .then((cdn) => Cdn.getBackendPrice(cdn.serviceName))
        .then((price) => {
          $scope.price = price;
        });
    }
  };

  $scope.loadBackendOrders = function loadBackendOrders() {
    Cdn.getBackendOrders($stateParams.productId, $scope.choices.count).then(
      (orders) => {
        let i = 0;
        for (i; i < orders.results.length; i += 1) {
          orders.results[i].duration.formattedDuration = parseInt(orders.results[i].duration.duration, 10); // eslint-disable-line
        }
        $scope.orders = orders.results;
      },
      (data) => {
        $scope.resetAction();
        $scope.setMessage($translate.instant('cdn_configuration_backend_upgrade_fail'), data);
      },
    );
  };

  $scope.updateOrder = function updateOrder() {
    const choosenOrder = $.grep(
      $scope.orders,
      (e) => e.duration.duration === $scope.choices.duration,
    );
    if (choosenOrder.length > 0) {
      $scope.choices.order = head(choosenOrder);
    }
  };

  $scope.orderBackends = function orderBackends() {
    $scope.url = null;
    Cdn
      .orderBackends(
        $stateParams.productId,
        $scope.choices.count,
        $scope.choices.order.duration.duration,
      )
      .then((order) => {
        $scope.url = order.url;
      })
      .catch((data) => {
        $scope.resetAction();
        $scope.setMessage($translate.instant('cdn_configuration_backend_upgrade_fail'), data);
      });
  };

  $scope.displayBC = function displayBC() {
    $scope.resetAction();
    window.open($scope.url, '_blank');
  };
});
