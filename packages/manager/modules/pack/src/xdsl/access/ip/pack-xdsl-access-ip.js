angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.access-ip', {
    url: '/ip/:block',
    views: {
      'accessView@pack.xdsl': {
        controller: 'XdslAccessIpCtrl',
        controllerAs: 'XdslAccessIp',
        templateUrl: 'app/telecom/pack/xdsl/access/ip/pack-xdsl-access-ip.html',
      },
    },
    translations: ['.', './order'],
  });
});
