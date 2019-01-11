angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.ovhPabx.menus', {
    url: '/menus',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/ovhPabx/menus/telecom-telephony-alias-configuration-ovhPabx-menus.html',
        controller: 'TelecomTelephonyAliasConfigurationOvhPabxMenusCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
