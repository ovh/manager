angular.module('managerApp').config(($stateProvider) => {
  $stateProvider
    .state('dbaas.logs.detail.aliases', {
      url: '/aliases',
      redirectTo: 'dbaas.logs.detail.aliases.home',
      views: {
        logsContent: {
          templateUrl: 'app/dbaas/logs/detail/aliases/logs-aliases.html',
          controller: 'LogsAliasesCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.aliases.home', {
      url: '/home',
      views: {
        logsAliases: {
          templateUrl:
            'app/dbaas/logs/detail/aliases/home/logs-aliases-home.html',
          controller: 'LogsAliasesHomeCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.aliases.home.add', {
      url: '/add',
      views: {
        logsAliasesAddEdit: {
          controller: 'LogsAliasesAddModalCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.aliases.home.edit', {
      url: '/:aliasId',
      views: {
        logsAliasesAddEdit: {
          controller: 'LogsAliasesAddModalCtrl',
          controllerAs: 'ctrl',
        },
      },
    })
    .state('dbaas.logs.detail.aliases.link', {
      url: '/:aliasId/link',
      params: {
        defaultContent: null,
      },
      views: {
        logsAliases: {
          templateUrl: 'app/dbaas/logs/detail/aliases/link/aliases-link.html',
          controller: 'LogsAliasesLinkCtrl',
          controllerAs: 'ctrl',
        },
      },
    });
});
