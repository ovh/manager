angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.dashboard', {
    url: '',
    views: {
      'aliasInnerView@telecom.telephony.billingAccount.alias': {
        templateUrl:
          'app/telecom/telephony/alias/dashboard/telecom-telephony-alias-dashboard.html',
        controller: 'TelecomTelephonyAliasDashboardController',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['..'], format: 'json' },
  });
});
