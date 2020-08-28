angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.telephony.billingAccount.alias.details.configuration.queues',
    {
      url: '/queues',
      abstract: true,
      translations: { value: ['.'], format: 'json' },
    },
  );
});
