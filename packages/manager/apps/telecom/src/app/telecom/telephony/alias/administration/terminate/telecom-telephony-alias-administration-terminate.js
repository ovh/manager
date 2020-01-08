angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.terminate', {
    url: '/terminate',
    views: {
      'aliasView@telecom.telephony.billingAccount.alias': {
        templateUrl:
          'app/telecom/telephony/alias/administration/terminate/telecom-telephony-alias-administration-terminate.html',
        controller: 'TelecomTelephonyAliasAdministrationTerminateCtrl',
        controllerAs: 'AliasTerminateCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
