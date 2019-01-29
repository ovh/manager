angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.access-resiliation', {
    url: '/resiliation',
    views: {
      'accessView@telecom.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/resiliation/pack-xdsl-resiliation.html',
        controller: 'PackXdslResiliationCtrl',
        controllerAs: 'PackXdslResiliation',
      },
    },
    translations: ['.'],
  });
});
