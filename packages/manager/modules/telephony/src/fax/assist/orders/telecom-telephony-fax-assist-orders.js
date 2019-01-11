angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.assist.orders', {
    url: '/orders',
    views: {
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/service/assist/orders/telecom-telephony-service-assist-orders.html',
        controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
        controllerAs: 'OrdersCtrl',
      },
    },
    translations: ['../../../service/assist/orders'],
  });
});
