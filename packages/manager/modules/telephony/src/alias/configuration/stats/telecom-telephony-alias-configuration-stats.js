angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.stats', {
    url: '/stats',
    abstract: true,
    translations: ['.'],
  });
});
