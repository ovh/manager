angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.orderAlias.nongeographical', {
    url: '/nonGeographical',
    views: {
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/nonGeographical/telecom-telephony-billing-account-orderAlias-nonGeographical.html',
        controller: 'TelecomTelephonyAliasOrderNonGeographicalCtrl',
        controllerAs: 'AliasOrderNonGeographicalCtrl',
      },
    },
    translations: ['.'],
  });
});
