export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.assist.orders', {
    url: '/orders',
    views: {
      'faxView@telecom.telephony.billingAccount.fax': {
        templateUrl: 'app/telecom/telephony/service/assist/orders/orders.html',
        controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
        controllerAs: 'OrdersCtrl',
      },
    },
  });
};
