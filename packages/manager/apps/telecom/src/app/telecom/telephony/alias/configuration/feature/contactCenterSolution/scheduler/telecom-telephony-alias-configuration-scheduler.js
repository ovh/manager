angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.timeCondition.scheduler',
    {
      url: '/scheduler',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/feature/contactCenterSolution/scheduler/telecom-telephony-alias-configuration-scheduler.html',
          controller: 'TelecomTelephonyAliasConfigurationSchedulerCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.'], format: 'json' },
    },
  );
});
