angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.mode.easyPabx', {
    url: '/easyPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/mode/easyPabx/telecom-telephony-alias-configuration-mode-easyPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationModeEasyPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
