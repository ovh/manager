angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs.detail.kibana', {
    url: '/kibana',
    views: {
      logsContent: {
        templateUrl: 'app/dbaas/logs/detail/kibana/logs-kibana.html',
        controller: 'LogsKibanaCtrl',
        controllerAs: 'ctrl',
      },
    },
  });
});
