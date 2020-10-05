export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.aliases.home.add', {
      url: '/add',
      views: {
        logsAliasesAddEdit: 'dbaasLogsDetailAliasesAdd',
      },
    })
    .state('dbaas-logs.detail.aliases.home.edit', {
      url: '/:aliasId',
      views: {
        logsAliasesAddEdit: 'dbaasLogsDetailAliasesAdd',
      },
    });
};
