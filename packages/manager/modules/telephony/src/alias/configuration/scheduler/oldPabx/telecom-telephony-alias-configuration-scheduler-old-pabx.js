angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.scheduler.oldPabx', {
    url: '/oldPabx',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/scheduler/oldPabx/telecom-telephony-alias-configuration-scheduler-old-pabx.html',
        controller: 'TelecomTelephonyAliasConfigurationSchedulerOldPabxCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
