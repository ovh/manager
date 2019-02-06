angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.access-order', {
    url: '/order',
    views: {
      'accessView@telecom.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp.html',
      },
      'followUp@telecom.pack.xdsl.access-order': {
        templateUrl: 'app/telecom/pack/xdsl/orderFollowUp/pack-xdsl-orderFollowUp-main.view.html',
        controller: 'XdslOrderFollowUpCtrl',
        controllerAs: 'OrderFollowUpCtrl',
      },
    },
    translations: ['.'],
  });
});
