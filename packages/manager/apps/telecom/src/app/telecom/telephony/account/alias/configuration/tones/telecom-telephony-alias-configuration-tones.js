angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.tones',
    {
      url: '/tones',
      abstract: true,
      translations: { value: ['.'], format: 'json' },
    },
  );
});
