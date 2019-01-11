angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.ovhPabx', {
    url: '/ovhPabx',
    abstract: true,
    translations: ['.'],
  });
});
