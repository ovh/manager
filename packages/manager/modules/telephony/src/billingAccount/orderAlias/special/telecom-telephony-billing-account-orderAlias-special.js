angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.orderAlias.special', {
    url: '/special',
    views: {
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/special/telecom-telephony-billing-account-orderAlias-special.html',
        controller: 'TelecomTelephonyAliasOrderSpecialCtrl',
        controllerAs: 'AliasOrderSpecialCtrl',
      },
    },
    translations: ['.', '../../../alias/special/rsva'],
  });
});
