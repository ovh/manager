export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.aliases.home.alias.edit', {
    url: '/edit',
    views: {
      'logsAliasesAddEdit@dbaas-logs.detail.aliases.home':
        'dbaasLogsDetailAliasesAdd',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
