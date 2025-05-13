angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.orders.alias', {
      url: '/orders/alias',
      views: {
        'ordersView@telecom.orders': {
          templateUrl: 'app/telecom/orders/alias/telecom-orders-alias.html',
          controller: 'TelecomOrdersAliasCtrl',
          controllerAs: 'OrdersAliasCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telecom_orders_alias_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
