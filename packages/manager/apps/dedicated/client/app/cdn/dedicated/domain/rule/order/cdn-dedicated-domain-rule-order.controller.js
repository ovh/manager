import head from 'lodash/head';

export default /* @ngInject */ (
  $scope,
  $stateParams,
  $translate,
  cdnDedicatedOrderRule,
  Alerter,
) => {
  $scope.alert = 'cdn_domain_tab_rules_alert';
  $scope.prices = null;
  $scope.choices = {
    count: null,
    duration: null,
    order: null,
  };
  $scope.contractsValidated = {};

  $scope.loadCacherulesPrice = function loadCacherulesPrice() {
    $scope.cacheRulesLoading = true;

    if (!$scope.prices) {
      cdnDedicatedOrderRule
        .getCacherulePrices($stateParams.productId)
        .then((prices) => {
          $scope.prices = prices.results;
        })
        .catch((error) => {
          $scope.resetAction();
          Alerter.alertFromSWS(
            $translate.instant('cdn_configuration_cacherules_upgrade_fail'),
            error,
            $scope.alert,
          );
        })
        .finally(() => {
          $scope.cacheRulesLoading = false;
        });
    }
  };

  $scope.loadCacherulesOrders = function loadCacherulesOrders() {
    $scope.orders = null;
    cdnDedicatedOrderRule
      .getCacheruleOrders($stateParams.productId, $scope.choices.count)
      .then(
        (orders) => {
          let i = 0;
          for (i; i < orders.results.length; i += 1) {
            // eslint-disable-next-line no-param-reassign
            orders.results[i].duration.formattedDuration = parseInt(
              orders.results[i].duration.duration,
              10,
            );
          }
          $scope.orders = orders.results;
        },
        (data) => {
          $scope.resetAction();
          Alerter.alertFromSWS(
            $translate.instant('cdn_configuration_cacherules_upgrade_fail'),
            data,
            $scope.alert,
          );
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

  $scope.orderCacherules = function orderCacherules() {
    $scope.url = null;
    cdnDedicatedOrderRule
      .orderCacherules(
        $stateParams.productId,
        $scope.choices.count,
        $scope.choices.order.duration.duration,
      )
      .then((order) => {
        $scope.url = order.url;
      })
      .catch((data) => {
        $scope.resetAction();
        Alerter.alertFromSWS(
          $translate.instant('cdn_configuration_cacherules_upgrade_fail'),
          data,
          $scope.alert,
        );
      });
  };

  $scope.displayBC = function displayBC() {
    $scope.resetAction();
    window.open($scope.url, '_blank');
  };
};
