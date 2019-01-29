angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.voipEcoFax-activation', {
    url: '/voipEcoFax/activation',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom//pack/slots/voipEcoFax/activation/pack-voipEcoFax-activation.html',
        controller: 'PackFaxActivationCtrl',
        controllerAs: 'PackFaxActivationCtrl',
      },
    },
    translations: ['.'],
  });
});
