angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line-diagnostic', {
    url: '/lineDiagnostic?type',
    views: {
      'accessView@telecom.packs.pack.xdsl': {
        templateUrl:
          'app/telecom/pack/pack/xdsl/access/linediagnostic/pack-xdsl-access-linediagnostic.html',
        controller: 'PackxdslaccesslinediagnosticCtrl',
        controllerAs: 'PackxdslaccesslinediagnosticCtrl',
      },
    },
  });
});
