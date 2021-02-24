angular
  .module('managerApp')
  .config(($stateProvider) => {
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
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telecom_orders_accessories_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
