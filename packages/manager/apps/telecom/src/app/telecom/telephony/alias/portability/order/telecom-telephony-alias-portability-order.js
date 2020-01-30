angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.portabilityOrder', {
    url: '/portabilityOrder',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl:
          'app/telecom/telephony/alias/portability/order/telecom-telephony-alias-portability-order.html',
        controller: 'TelecomTelephonyAliasPortabilityOrderCtrl',
        controllerAs: 'PortabilityOrderCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
