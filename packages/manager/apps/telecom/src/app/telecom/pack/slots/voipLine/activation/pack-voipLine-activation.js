angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.voipLine-activation', {
    url: '/telephony/activation',
    views: {
      'packView@telecom.packs': {
        templateUrl: 'app/telecom/pack/slots/voipLine/activation/pack-voipLine-activation.html',
        controller: 'PackVoipLineActivationCtrl',
        controllerAs: 'PackVoipLineActivationCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
