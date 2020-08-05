angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax.management', {
    url: '/management',
    abstract: true,
  });
});
