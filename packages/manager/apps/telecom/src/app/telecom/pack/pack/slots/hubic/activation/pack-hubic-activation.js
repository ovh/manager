angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hubic-activation', {
    url: '/hubic/activation',
    views: {
      'packView@telecom.packs': {
        templateUrl:
          'app/telecom/pack/pack/slots/hubic/activation/pack-hubic-activation.html',
        controller: 'PackHubicActivationCtrl',
        controllerAs: 'PackHubicActivation',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
