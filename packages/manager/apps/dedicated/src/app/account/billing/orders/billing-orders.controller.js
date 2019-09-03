import find from 'lodash/find';
import head from 'lodash/head';
import set from 'lodash/set';
import snakeCase from 'lodash/snakeCase';

angular.module('Billing.controllers').controller('Billing.controllers.Orders', ($q, $log, $scope, $location, $translate, Alerter, BillingOrders, BillingOrdersApiv7, BillingOrderStatusEnum, BillingOrdersStatusFilters, BillingUser) => {
  $scope.itemsPerPage = 10;
  $scope.orderIds = [];
  $scope.loaders = {
    orders: false,
  };
  $scope.activeFilter = {};
  $scope.ordersStatus = {};

  function init() {
    BillingOrdersStatusFilters.getFilterConfig()
      .then((filterConfig) => {
        $scope.statusFilters = filterConfig;
        const search = $location.search();
        if (search.status) {
          $scope.activeFilter.status = find($scope.statusFilters, {
            id: search.status,
          });
        }
        if (search.orderId) {
          $scope.activeFilter.orderId = parseInt(search.orderId, 10);
        }

        if (angular.isUndefined($scope.activeFilter.status)) {
          $scope.activeFilter.status = head($scope.statusFilters);
        }

        return BillingOrderStatusEnum.getEnum();
      })
      .then((statusEnum) => {
        $scope.ORDER_STATUS_ENUM = statusEnum;
      })
      .then(() => $scope.getOrders());
  }

  $scope.getOrders = function (forceRefresh) {
    $scope.orderIds = [];
    $scope.loaders.orders = true;
    Alerter.alertFromSWS(null);

    if ($scope.activeFilter.status) {
      $location.search('status', $scope.activeFilter.status.id);
    }

    if (forceRefresh) {
      BillingOrdersApiv7.clearCache();
    }

    let filters = {};
    if (angular.isFunction($scope.activeFilter.status.getFilter)) {
      filters = $scope.activeFilter.status.getFilter();
    }

    if ($scope.activeFilter.orderId) {
      $location.search('orderId', $scope.activeFilter.orderId);
      filters['orderId:in'] = $scope.activeFilter.orderId;
    }

    return $q
      .all({
        ordersByStatus: BillingOrdersApiv7.getOrderIdsByStatus({
          statusList: $scope.activeFilter.status.statusList,
        }),
        expiredOrders: BillingOrdersApiv7.getExpiredOrderIds(),
      })
      .then((response) => {
        response.ordersByStatus.data.forEach((order) => {
          $scope.ordersStatus[order.orderId] = order.status;
        });
        return response;
      })
      .then((response) => {
        $scope.orderIds = response.ordersByStatus.data
          .map((order) => {
            if (response.expiredOrders.data.includes(order.orderId)) {
              // expired order -> to remove if it's not payed
              if (order.status === 'notPaid') {
                return null;
              }
            }
            if ($scope.activeFilter.orderId
              && $scope.activeFilter.orderId.toString() !== order.orderId) {
              return null;
            }

            return order.orderId;
          })
          .filter(id => id !== null)
          .sort((a, b) => b - a);
      })
      .catch((err) => {
        $log.error(err);
        Alerter.alertFromSWS($translate.instant('orders_informations_error'), err.data);
        return $q.reject(err);
      })
      .finally(() => {
        $scope.loaders.orders = false;
      });
  };

  $scope.transformItem = function (item) {
    $scope.loaders.orders = true;
    return BillingOrders.getOrder(item)
      .then((order) => {
        set(order, 'status', $scope.ordersStatus[order.orderId]);
        set(order, 'expired', moment().isAfter(order.expirationDate));
        set(order, 'statusText', $translate.instant(`orders_order_status_${snakeCase(order.status)}`));
        return order;
      })
      .then((order) => {
        if (order.status === 'delivered') {
          return BillingOrders.getOrderBill(order.orderId)
            .then((bill) => {
              set(order, 'bill', bill);
              return order;
            })
            .catch((err) => {
              $log.warn(err.message);
              return order;
            });
        }
        return order;
      })
      .catch(err => ({
        error: err,
        orderId: item,
        statusText: $translate.instant('orders_order_loading_error'),
      }));
  };

  $scope.onTransformItemDone = function () {
    $scope.loaders.orders = false;
  };

  $scope.refreshOrders = function () {
    $scope.getOrders(true);
  };

  BillingUser.isVATNeeded().then((result) => {
    $scope.isVATNeeded = result;
  });

  init();
});
