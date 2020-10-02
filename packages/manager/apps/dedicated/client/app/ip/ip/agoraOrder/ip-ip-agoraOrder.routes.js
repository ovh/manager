angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.agora-order', {
    url: '/agoraOrder',
    params: {
      service: null,
      user: {},
    },
    templateUrl: 'ip/ip/agoraOrder/ip-ip-agoraOrder.html',
    controller: 'agoraIpOrderCtrl',
    controllerAs: 'ctrl',
    layout: 'modal',
    translations: { value: [], format: 'json' },
  });
});
