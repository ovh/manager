angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.move', {
    url: '/move',
    views: {
      'packView@telecom.packs': {
        templateUrl: 'app/telecom/pack/pack/move/pack-move.html',
        controller: 'PackMoveCtrl',
        controllerAs: 'PackMove',
      },
    },
    translations: { value: ['.', './contract'], format: 'json' },
  });
});
