export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.fax.dashboard.assist.orders',
    {
      url: '/orders',
      views: {
        'faxView@telecom.telephony.billingAccount.fax.dashboard': {
          templateUrl:
            'app/telecom/telephony/service/assist/orders/orders.html',
          controller: 'TelecomTelephonyServiceAssistOrdersCtrl',
          controllerAs: 'OrdersCtrl',
        },
      },
    },
  );
};
