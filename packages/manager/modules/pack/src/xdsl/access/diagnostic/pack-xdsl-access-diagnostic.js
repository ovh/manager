angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.access-diagnostic', {
    url: '/diagnostic',
    views: {
      'accessView@pack.xdsl': {
        controller: 'XdslDiagnosticCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'app/telecom/pack/xdsl/access/diagnostic/pack-xdsl-access-diagnostic.html',
      },
    },
    translations: ['.'],
  });
});
