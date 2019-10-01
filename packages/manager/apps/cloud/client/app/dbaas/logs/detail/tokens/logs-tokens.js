angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.tokens', {
      url: '/tokens',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/tokens/logs-tokens.html',
          controller: 'LogsTokensCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.tokens.add', {
      url: '/add',
      views: {
        logsTokensAdd: {
          controller: 'LogsTokenAddModalCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
