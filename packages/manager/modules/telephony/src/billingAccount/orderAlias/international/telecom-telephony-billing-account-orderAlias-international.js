angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.orderAlias.international', {
    url: '/international',
    views: {
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/international/telecom-telephony-billing-account-orderAlias-international.html',
        controller: 'TelecomTelephonyAliasOrderInternationalCtrl',
        controllerAs: 'AliasOrderInternationalCtrl',
      },
    },
    translations: ['.'],
  });
});
