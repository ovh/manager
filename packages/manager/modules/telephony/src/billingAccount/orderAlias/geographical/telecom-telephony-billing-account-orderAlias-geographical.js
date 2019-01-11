angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.orderAlias.geographical', {
    url: '/geographical',
    views: {
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/geographical/telecom-telephony-billing-account-orderAlias-geographical.html',
        controller: 'TelecomTelephonyAliasOrderGeographicalCtrl',
        controllerAs: 'AliasOrderGeographicalCtrl',
      },
    },
    translations: ['.'],
  });
});
