angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.orders', {
    url: '/orders',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl:
          'app/telecom/telephony/service/assist/orders/telecom-telephony-service-assist-orders.html',
        controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
        controllerAs: 'OrdersCtrl',
      },
    },
    translations: { value: ['../../../service/assist/orders'], format: 'json' },
  });
});
