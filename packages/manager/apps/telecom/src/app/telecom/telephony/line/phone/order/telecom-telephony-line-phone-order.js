angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.order', {
    url: '/order',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/phone/order/telecom-telephony-line-phone-order.html',
        controller: 'TelecomTelephonyLinePhoneOrderCtrl',
        controllerAs: 'PhoneOrderCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
