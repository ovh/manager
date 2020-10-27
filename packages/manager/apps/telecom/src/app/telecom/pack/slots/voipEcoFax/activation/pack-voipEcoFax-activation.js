angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipEcoFax-activation', {
    url: '/voipEcoFax/activation',
    templateUrl:
      'app/telecom//pack/slots/voipEcoFax/activation/pack-voipEcoFax-activation.html',
    controller: 'PackFaxActivationCtrl',
    controllerAs: 'PackFaxActivationCtrl',
    translations: { value: ['.'], format: 'json' },
  });
});
