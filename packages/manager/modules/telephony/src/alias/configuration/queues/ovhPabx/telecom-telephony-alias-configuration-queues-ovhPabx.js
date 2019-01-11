angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.queues.ovhPabx', {
    url: '/ovhPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/queues/ovhPabx/telecom-telephony-alias-configuration-queues-ovhPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationQueuesOvhPabxCtrl',
        controllerAs: 'QueuesOvhPabxCtrl',
      },
    },
    translations: ['..'],
  });
});
