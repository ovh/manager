angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail', {
      url: '/{serviceName:[a-zA-Z0-9]+-[a-zA-Z0-9-]+}', // logs-12380-1231
      redirectTo: 'dbaas.logs.detail.home',
      views: {
        logsHeader: {
          templateUrl: 'app/dbaas/logs/header/logs-dashboard-header.html',
          controller: 'LogsDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        logsContainer: {
          templateUrl: 'app/dbaas/logs/detail/logs-detail.html',
          controller: 'LogsDetailCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.setup', {
      url: '/setup',
      views: {
        logsContent: {
          templateUrl:
            'app/dbaas/logs/detail/account/setup/logs-account-setup.html',
          controller: 'LogsAccountSetupCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
