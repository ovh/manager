angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.access-resiliation', {
    url: '/resiliation',
    views: {
      'accessView@pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/resiliation/pack-xdsl-resiliation.html',
        controller: 'PackXdslResiliationCtrl',
        controllerAs: 'PackXdslResiliation',
      },
    },
    translations: ['.'],
  });
});
