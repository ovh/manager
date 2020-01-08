angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.options', {
      url: '/options',
      redirectTo: 'dbaas.logs.detail.options.home',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/options/logs-options.html',
          controller: 'LogsOptionsCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.options.home', {
      url: '/home',
      views: {
        logsOptions: {
          templateUrl:
            'app/dbaas/logs/detail/options/home/logs-options-home.html',
          controller: 'LogsOptionsCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.options.manage', {
      url: '/manage',
      views: {
        logsOptions: {
          templateUrl:
            'app/dbaas/logs/detail/options/manage/logs-options-manage.html',
          controller: 'LogsOptionsManageCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
