angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.svaGenerator',
    {
      url: '/svaGenerator',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/svaGenerator/telecom-telephony-alias-svaGenerator.html',
          controller: 'TelecomTelephonyAliasSvaGeneratorCtrl',
          controllerAs: 'SvaGeneratorCtrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
