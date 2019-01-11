angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.agents', {
    url: '/agents',
    abstract: true,
    translations: ['.'],
  });
});
