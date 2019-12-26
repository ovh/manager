angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs.list', {
    url: '/list',
    views: {
      logsHeader: {
        templateUrl: 'app/dbaas/logs/header/logs-list-header.html',
        controller: 'LogsListHeaderCtrl',
        controllerAs: 'ctrl',
      },
      logsContainer: {
        templateUrl: 'app/dbaas/logs/list/logs-list.html',
        controller: 'LogsListCtrl',
        controllerAs: 'ctrl',
      },
    },
  });
});
