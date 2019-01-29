angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.domain-activation', {
    url: '/domain/activation',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/domain/activation/pack-domain-activation.html',
        controller: 'PackDomainActivationController',
        controllerAs: 'PackDomainActivation',
      },
    },
    translations: ['.'],
  });
});
