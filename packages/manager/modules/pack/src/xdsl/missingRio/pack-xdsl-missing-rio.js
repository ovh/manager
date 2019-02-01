angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.missing-rio', {
    url: '/missingRio',
    views: {
      'accessView@pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/missingRio/pack-xdsl-missing-rio.html',
        controller: 'PackXdslMissingRioCtrl',
        controllerAs: 'PackXdslMissingRio',
      },
    },
    translations: ['.'],
  });
});
