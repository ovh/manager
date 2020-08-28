angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.stats.easyHunting',
    {
      url: '/easyHunting',
      views: {
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/configuration/stats/easyHunting/telecom-telephony-alias-configuration-stats-easyHunting.html',
          controller: 'TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl',
          controllerAs: 'StatsEasyHuntingCtrl',
        },
      },
    },
  );
});
