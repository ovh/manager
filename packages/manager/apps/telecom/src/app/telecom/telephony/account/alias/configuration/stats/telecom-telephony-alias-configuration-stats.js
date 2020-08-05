angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.stats',
    {
      url: '/stats',
      abstract: true,
      translations: { value: ['.'], format: 'json' },
    },
  );
});
