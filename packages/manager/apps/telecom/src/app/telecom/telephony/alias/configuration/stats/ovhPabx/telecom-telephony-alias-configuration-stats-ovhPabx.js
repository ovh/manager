angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.stats.ovhPabx',
    {
      url: '/ovhPabx',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/stats/ovhPabx/telecom-telephony-alias-configuration-stats-ovhPabx.html',
          controller: 'TelecomTelephonyAliasConfigurationStatsOvhPabxCtrl',
          controllerAs: 'StatsOvhPabxCtrl',
        },
      },
    },
  );
});
