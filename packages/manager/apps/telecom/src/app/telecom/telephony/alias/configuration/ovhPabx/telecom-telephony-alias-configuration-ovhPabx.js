angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.ovhPabx',
    {
      url: '/ovhPabx',
      abstract: true,
      translations: { value: ['.'], format: 'json' },
    },
  );
});
