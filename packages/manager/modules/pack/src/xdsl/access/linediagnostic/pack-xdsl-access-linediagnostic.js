angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.line-diagnostic', {
    url: '/lineDiagnostic?type',
    views: {
      'accessView@telecom.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/access/linediagnostic/pack-xdsl-access-linediagnostic.html',
        controller: 'PackxdslaccesslinediagnosticCtrl',
        controllerAs: 'PackxdslaccesslinediagnosticCtrl',
      },
    },
  });
});
