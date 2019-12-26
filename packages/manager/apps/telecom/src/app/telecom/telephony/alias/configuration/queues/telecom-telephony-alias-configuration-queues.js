angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.configuration.queues',
    {
      url: '/queues',
      abstract: true,
      translations: { value: ['.'], format: 'json' },
    },
  );
});
