angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.orders', {
      url: '/orders',
      views: {
        'telecomView@telecom': {
          templateUrl: 'app/telecom/orders/telecom-orders-main.view.html',
        },
        'ordersView@telecom.orders': {
          templateUrl: 'app/telecom/orders/telecom-orders.html',
          controller: 'TelecomOrdersCtrl',
          controllerAs: 'OrdersCtrl',
        },
      },
      translations: { value: ['../pack/common'], format: 'json' },
      resolve: {
        $title: /* @ngInject */ ($translate) => {
          return $translate('telecom_order_page_title');
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telecom_orders_follow_up_title'),
        hideBreadcrumb: () => true,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
