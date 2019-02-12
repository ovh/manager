angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.access-order', {
    url: '/order',
    views: {
      'accessView@pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp.html',
      },
      'followUp@pack.xdsl.access-order': {
        templateUrl: 'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp-main.view.html',
        controller: 'XdslOrderFollowUpCtrl',
        controllerAs: 'OrderFollowUpCtrl',
      },
    },
    translations: ['.'],
  });
});
