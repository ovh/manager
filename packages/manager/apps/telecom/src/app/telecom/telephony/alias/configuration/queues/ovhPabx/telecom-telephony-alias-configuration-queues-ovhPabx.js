angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration.queues.ovhPabx', {
    url: '/ovhPabx',
    views: {
      'aliasView@telecom.telephony.billingAccount.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/queues/ovhPabx/telecom-telephony-alias-configuration-queues-ovhPabx.html',
        controller: 'TelecomTelephonyAliasConfigurationQueuesOvhPabxCtrl',
        controllerAs: 'QueuesOvhPabxCtrl',
      },
    },
    translations: { value: ['..', './hunting-sounds'], format: 'json' },
  });
});
