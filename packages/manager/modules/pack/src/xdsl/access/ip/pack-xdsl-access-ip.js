angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.pack.xdsl.access-ip', {
    url: '/ip/:block',
    views: {
      'accessView@telecom.pack.xdsl': {
        controller: 'XdslAccessIpCtrl',
        controllerAs: 'XdslAccessIp',
        templateUrl: 'app/telecom/pack/xdsl/access/ip/pack-xdsl-access-ip.html',
      },
    },
    translations: ['.', './order'],
  });
});
