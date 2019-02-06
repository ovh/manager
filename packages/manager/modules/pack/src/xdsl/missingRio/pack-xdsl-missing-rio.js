angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.missing-rio', {
    url: '/missingRio',
    views: {
      'accessView@telecom.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/missingRio/pack-xdsl-missing-rio.html',
        controller: 'PackXdslMissingRioCtrl',
        controllerAs: 'PackXdslMissingRio',
      },
    },
    translations: ['.'],
  });
});
