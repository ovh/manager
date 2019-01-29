angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.access-diagnostic', {
    url: '/diagnostic',
    views: {
      'accessView@telecom.pack.xdsl': {
        controller: 'XdslDiagnosticCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'app/telecom/pack/xdsl/access/diagnostic/pack-xdsl-access-diagnostic.html',
      },
    },
    translations: ['.'],
  });
});
