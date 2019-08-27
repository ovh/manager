angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.statistics', {
    url: '/statistics',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/statistics/telecom-telephony-alias-statistics.html',
        controller: 'TelecomTelephonyAliasStatisticsCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
