angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.orderAlias.geographical',
    {
      url: '/geographical',
      views: {
        'telecomTelephonyBillingAccountOrderAliasView@telecom.telephony.billingAccount.orderAlias': {
          templateUrl:
            'app/telecom/telephony/billingAccount/orderAlias/geographical/telecom-telephony-billing-account-orderAlias-geographical.html',
          controller: 'TelecomTelephonyAliasOrderGeographicalCtrl',
          controllerAs: 'AliasOrderGeographicalCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
