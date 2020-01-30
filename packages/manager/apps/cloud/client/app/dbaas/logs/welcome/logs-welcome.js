angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('dbaas.logs.welcome', {
    url: '/welcome',
    views: {
      logsHeader: {
        templateUrl: 'app/dbaas/logs/header/logs-list-header.html',
        controller: 'LogsListHeaderCtrl',
        controllerAs: 'ctrl',
      },
      logsContainer: {
        templateUrl: 'app/dbaas/logs/welcome/logs-welcome.html',
        controller: 'LogsWelcomeCtrl',
        controllerAs: 'ctrl',
      },
    },
  });
});
