angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.orders.show', {
    url: '/:serviceName',
    views: {
      'ordersView@telecom.orders': {
        templateUrl: 'app/telecom/orders/show/telecom-orders-show.html',
        controller: 'TelecomOrdersShowCtrl',
        controllerAs: 'OrdersShowCtrl',
        noTranslations: true,
      },
      'followUp@telecom.orders.show': {
        templateUrl:
          'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp-main.view.html',
        controller: 'XdslOrderFollowUpCtrl',
        controllerAs: 'OrderFollowUpCtrl',
      },
    },
    translations: { value: ['../../pack/xdsl/orderFollowUp'], format: 'json' },
  });
});
