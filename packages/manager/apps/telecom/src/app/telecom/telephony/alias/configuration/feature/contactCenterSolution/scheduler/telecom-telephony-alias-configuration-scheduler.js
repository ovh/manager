angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.timeCondition.scheduler', {
    url: '/scheduler',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/scheduler/telecom-telephony-alias-configuration-scheduler.html',
        controller: 'TelecomTelephonyAliasConfigurationSchedulerCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
