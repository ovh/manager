angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.tones.oldPabx', {
    url: '/oldPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/tones/oldPabx/telecom-telephony-alias-configuration-tones-oldPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationTonesOldPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
