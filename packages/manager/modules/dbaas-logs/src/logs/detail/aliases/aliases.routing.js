export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.aliases', {
    url: '/aliases',
    redirectTo: 'dbaas-logs.detail.aliases.home',
    views: {
      logsContent: 'dbaasLogsDetailAliases',
    },
  });
};
