angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.callsFiltering.oldPabx', {
    url: '/oldPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/callsFiltering/oldPabx/telecom-telephony-alias-configuration-callsFiltering-oldPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationCallsFilteringOldPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
