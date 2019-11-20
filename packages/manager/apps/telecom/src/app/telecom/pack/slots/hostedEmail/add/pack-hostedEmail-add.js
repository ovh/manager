angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.hostedEmail-add', {
    url: '/hostedEmail/add',
    views: {
      'packView@telecom.packs': {
        templateUrl: 'app/telecom/pack/slots/hostedEmail/add/pack-hostedEmail-add.html',
        controller: 'PackHostedEmailAddCtrl',
        controllerAs: 'ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
