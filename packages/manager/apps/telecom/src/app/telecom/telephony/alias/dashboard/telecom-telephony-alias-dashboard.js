angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.dashboard',
    {
      url: '',
      views: {
        'aliasInnerView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/dashboard/telecom-telephony-alias-dashboard.html',
          controller: 'TelecomTelephonyAliasDashboardController',
          controllerAs: '$ctrl',
        },
      },
      translations: { value: ['..'], format: 'json' },
    },
  );
});
