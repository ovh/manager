angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.schedulerOvhPabx',
    {
      url: '/ovhPabx/scheduler',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/scheduler/ovhPabx/telecom-telephony-alias-configuration-scheduler-ovh-pabx.html',
          controller: 'TelecomTelephonyAliasConfigurationSchedulerOvhPabxCtrl',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['.', '..'], format: 'json' },
    },
  );
});
