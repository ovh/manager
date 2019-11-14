angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration.agents', {
    url: '/agents',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
  });
});
