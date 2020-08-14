angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.line.access-order', {
    url: '/order',
    views: {
      'accessView@telecom.packs.pack.xdsl.line': {
        templateUrl:
          'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp.html',
      },
      'followUp@telecom.packs.pack.xdsl.line.access-order': {
        templateUrl:
          'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp-main.view.html',
        controller: 'XdslOrderFollowUpCtrl',
        controllerAs: 'OrderFollowUpCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
