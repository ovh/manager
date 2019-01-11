angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.ovhPabx.sounds', {
    url: '/sounds',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/ovhPabx/sounds/telecom-telephony-alias-configuration-ovhPabx-sounds.html',
        controller: 'TelecomTelephonyAliasConfigurationOvhPabxSoundsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
