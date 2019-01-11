angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.schedulerOvhPabx', {
    url: '/ovhPabx/scheduler',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/scheduler/ovhPabx/telecom-telephony-alias-configuration-scheduler-ovh-pabx.html',
        controller: 'TelecomTelephonyAliasConfigurationSchedulerOvhPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.', '..'],
  });
});
