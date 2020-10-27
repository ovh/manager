angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-resiliation', {
    url: '/resiliation',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        templateUrl:
          'app/telecom/pack/xdsl/resiliation/pack-xdsl-resiliation.html',
        controller: 'PackXdslResiliationCtrl',
        controllerAs: 'PackXdslResiliation',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
