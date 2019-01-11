angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.tones', {
    url: '/tones',
    abstract: true,
    translations: ['.'],
  });
});
