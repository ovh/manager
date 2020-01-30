angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs.detail.indices', {
    url: '/index',
    views: {
      logsContent: {
        templateUrl: 'app/dbaas/logs/detail/index/logs-index.html',
        controller: 'LogsIndexCtrl',
        controllerAs: 'ctrl',
      },
    },
  });
});
