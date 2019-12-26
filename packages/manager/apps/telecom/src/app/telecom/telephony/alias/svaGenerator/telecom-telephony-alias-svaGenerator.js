angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.svaGenerator', {
    url: '/svaGenerator',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl:
          'app/telecom/telephony/alias/svaGenerator/telecom-telephony-alias-svaGenerator.html',
        controller: 'TelecomTelephonyAliasSvaGeneratorCtrl',
        controllerAs: 'SvaGeneratorCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
