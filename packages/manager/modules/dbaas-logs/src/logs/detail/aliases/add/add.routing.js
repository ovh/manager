export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.aliases.home.add', {
    url: '/add',
    views: {
      'logsAliasesAddEdit@dbaas-logs.detail.aliases.home':
        'dbaasLogsDetailAliasesAdd',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
