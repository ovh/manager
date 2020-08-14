angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state(
    'telecom.packs.pack.xdsl.line.access-diagnostic-details',
    {
      url: '/diagnostic-details',
      templateUrl:
        'app/telecom/pack/xdsl/access/diagnostic/details/pack-xdsl-access-diagnostic-details.html',
      controller: 'XdslDiagnosticDetailsCtrl',
      controllerAs: '$ctrl',
      layout: 'modal',
      translations: { value: ['..'], format: 'json' },
    },
  );
});
