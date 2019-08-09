angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.nas.order', {
    url: '',
    views: {
      nasView: {
        templateUrl: 'dedicated/nas/order/nas-order.html',
        controller: 'NasOrderCtrl',
        controllerAs: 'nasOrder',
      },
    },
    reloadOnSearch: false,
  });
});
