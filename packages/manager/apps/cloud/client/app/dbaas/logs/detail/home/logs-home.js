angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.home', {
      url: '/home',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/home/logs-home.html',
          controller: 'LogsHomeCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.home.account', {
      url: '/account',
      views: {
        logsAccountContent: {
          controller: 'LogsHomeAccountModalCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
