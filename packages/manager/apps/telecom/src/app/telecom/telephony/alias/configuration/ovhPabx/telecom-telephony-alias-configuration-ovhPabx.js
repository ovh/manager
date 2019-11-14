angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.alias.configuration.ovhPabx', {
    url: '/ovhPabx',
    abstract: true,
    translations: { value: ['.'], format: 'json' },
  });
});
