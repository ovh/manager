angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-diagnostic', {
    url: '/diagnostic',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller: 'XdslDiagnosticCtrl',
        controllerAs: '$ctrl',
        templateUrl:
          'app/telecom/pack/xdsl/access/diagnostic/pack-xdsl-access-diagnostic.html',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
