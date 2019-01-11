angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.agents.ovhPabx', {
    url: '/ovhPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/agents/ovhPabx/telecom-telephony-alias-configuration-agents-ovhPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationAgentsOvhPabxCtrl',
        controllerAs: 'AgentsOvhPabxCtrl',
      },
    },
    translations: ['..'],
  });
});
