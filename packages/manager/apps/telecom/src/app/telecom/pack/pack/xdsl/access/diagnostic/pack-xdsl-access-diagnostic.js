angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.access-diagnostic', {
    url: '/diagnostic',
    views: {
      'accessView@telecom.packs.pack.xdsl': {
        controller: 'XdslDiagnosticCtrl',
        controllerAs: '$ctrl',
        templateUrl:
          'app/telecom/pack/pack/xdsl/access/diagnostic/pack-xdsl-access-diagnostic.html',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
