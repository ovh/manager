angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.orderAlias.international',
    {
      url: '/international',
      views: {
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          templateUrl:
            'app/telecom/telephony/billingAccount/orderAlias/international/telecom-telephony-billing-account-orderAlias-international.html',
          controller: 'TelecomTelephonyAliasOrderInternationalCtrl',
          controllerAs: 'AliasOrderInternationalCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
