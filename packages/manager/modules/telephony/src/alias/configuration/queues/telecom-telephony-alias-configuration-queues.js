angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.alias.configuration.queues', {
    url: '/queues',
    abstract: true,
    translations: ['.'],
  });
});
