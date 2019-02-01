angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.move', {
    url: '/move',
    views: {
      'packView@pack': {
        templateUrl: 'app/telecom/pack/move/pack-move.html',
        controller: 'PackMoveCtrl',
        controllerAs: 'PackMove',
      },
    },
    translations: ['.', './contract'],
  });
});
