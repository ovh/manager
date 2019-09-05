angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.networks.nas', {
    url: '/nas',
    templateUrl: 'dedicated/nas/nas.html',
    controller: 'NasCtrl',
    abstract: true,
    reloadOnSearch: false,
    translations: { value: ['.'], format: 'json' },
  });
});
