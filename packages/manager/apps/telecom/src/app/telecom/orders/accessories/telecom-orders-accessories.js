angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.orders.accessories', {
    url: '/accessories',
    views: {
      'ordersView@telecom.orders': {
        templateUrl:
          'app/telecom/orders/accessories/telecom-orders-accessories.html',
        controller: 'TelecomOrdersAccessoriesCtrl',
        controllerAs: 'AccessoriesOrderCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
