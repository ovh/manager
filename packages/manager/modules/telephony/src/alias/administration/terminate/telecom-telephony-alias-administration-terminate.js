angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.terminate', {
    url: '/terminate',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/administration/terminate/telecom-telephony-alias-administration-terminate.html',
        controller: 'TelecomTelephonyAliasAdministrationTerminateCtrl',
        controllerAs: 'AliasTerminateCtrl',
      },
    },
    translations: ['.'],
  });
});
