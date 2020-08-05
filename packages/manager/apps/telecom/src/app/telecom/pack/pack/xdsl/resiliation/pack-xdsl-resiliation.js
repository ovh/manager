angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.access-resiliation', {
    url: '/resiliation',
    views: {
      'accessView@telecom.packs.pack.xdsl': {
        templateUrl:
          'app/telecom/pack/pack/xdsl/resiliation/pack-xdsl-resiliation.html',
        controller: 'PackXdslResiliationCtrl',
        controllerAs: 'PackXdslResiliation',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
