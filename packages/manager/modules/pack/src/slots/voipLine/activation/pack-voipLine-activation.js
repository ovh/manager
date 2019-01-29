angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.voipLine-activation', {
    url: '/telephony/activation',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/slots/voipLine/activation/pack-voipLine-activation.html',
        controller: 'PackVoipLineActivationCtrl',
        controllerAs: 'PackVoipLineActivationCtrl',
      },
    },
    translations: ['.'],
  });
});
