angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.move', {
    url: '/move',
    views: {
      'packView@telecom.pack': {
        templateUrl: 'app/telecom/pack/move/pack-move.html',
        controller: 'PackMoveCtrl',
        controllerAs: 'PackMove',
      },
    },
    translations: ['.', './contract'],
  });
});
