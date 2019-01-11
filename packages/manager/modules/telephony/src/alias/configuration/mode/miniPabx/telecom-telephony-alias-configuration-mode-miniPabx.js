angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.mode.miniPabx', {
    url: '/miniPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/mode/miniPabx/telecom-telephony-alias-configuration-mode-miniPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationModeMiniPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
