angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.dashboard', {
    url: '',
    views: {
      'aliasInnerView@telecom.telephony.alias': {
        templateUrl: 'app/telecom/telephony/alias/dashboard/telecom-telephony-alias-dashboard.html',
        controller: 'TelecomTelephonyAliasDashboardController',
        controllerAs: '$ctrl',
      },
    },
    translations: ['..'],
  });
});
