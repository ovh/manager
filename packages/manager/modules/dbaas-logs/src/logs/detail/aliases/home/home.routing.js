export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.aliases.home', {
      url: '',
      views: {
        logsAliases: 'dbaasLogsDetailAliasesHome',
      },
      resolve: {
        breadcrumb: () => null,
      },
    })
    .state('dbaas-logs.detail.aliases.home.alias', {
      url: '/:aliasId',
      redirectTo: 'dbaas-logs.detail.aliases',
      template: '<div ui-view></div>',
      resolve: {
        aliasId: /* @ngInject */ ($transition$) =>
          $transition$.params().aliasId,
        breadcrumb: /* @ngInject */ (aliasId) => aliasId,
      },
    });
};
