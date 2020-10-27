export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.assist.orders', {
    url: '/orders',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/service/assist/orders/orders.html',
        controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
        controllerAs: 'OrdersCtrl',
      },
    },
  });
};
