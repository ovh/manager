angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.stats.easyHunting', {
    url: '/easyHunting',
    views: {
      'aliasView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/configuration/stats/easyHunting/telecom-telephony-alias-configuration-stats-easyHunting.html',
        controller: 'TelecomTelephonyAliasConfigurationStatsEasyHuntingCtrl',
        controllerAs: 'StatsEasyHuntingCtrl',
      },
    },
  });
});
