angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.assist.orders', {
    url: '/orders',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/service/assist/orders/telecom-telephony-service-assist-orders.html',
        controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
        controllerAs: 'OrdersCtrl',
      },
    },
    translations: ['../../../service/assist/orders'],
  });
});
