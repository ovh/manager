export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.aliases.home', {
    url: '/home',
    views: {
      logsAliases: 'dbaasLogsDetailAliasesHome',
    },
  });
};
