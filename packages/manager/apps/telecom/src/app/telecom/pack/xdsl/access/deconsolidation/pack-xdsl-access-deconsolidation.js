angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-deconsolidation', {
    url: '/deconsolidation',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        controller: 'XdslDeconsolidationCtrl',
        controllerAs: 'DeconCtrl',
        templateUrl:
          'app/telecom/pack/xdsl/access/deconsolidation/pack-xdsl-access-deconsolidation.html',
      },
    },
    translations: { value: ['.', './contract'], format: 'json' },
  });
});
