angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.orders-sms', {
      url: '/orders/sms',
      views: {
        'telecomView@telecom': {
          templateUrl: 'app/telecom/orders/sms/telecom-orders-sms.html',
        },
        'smsOrderView@telecom.orders-sms': {
          templateUrl: 'app/telecom/sms/order/telecom-sms-order.html',
          controller: 'TelecomSmsOrderCtrl',
          controllerAs: 'SmsOrder',
        },
      },
      translations: { value: ['../../sms/order'], format: 'json' },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_order_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
