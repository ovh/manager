angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.ovhPabx.tts', {
    url: '/tts',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/ovhPabx/tts/telecom-telephony-alias-configuration-ovhPabx-tts.html',
        controller: 'TelecomTelephonyAliasConfigurationOvhPabxTtsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
