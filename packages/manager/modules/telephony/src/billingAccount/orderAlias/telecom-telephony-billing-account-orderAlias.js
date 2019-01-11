angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.orderAlias', {
    url: '/orderAlias',
    views: {
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias.html',
      },
      'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.orderAlias': {
        templateUrl: 'app/telecom/telephony/billingAccount/orderAlias/telecom-telephony-billing-account-orderAlias-main.view.html',
        controller: 'TelecomTelephonyBillingAccountOrderAliasCtrl',
        controllerAs: 'AliasOrderCtrl',
      },
    },
    translations: ['.'],
  });
});
