angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.missing-rio', {
    url: '/missingRio',
    views: {
      'accessView@telecom.packs.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/missingRio/pack-xdsl-missing-rio.html',
        controller: 'PackXdslMissingRioCtrl',
        controllerAs: 'PackXdslMissingRio',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
