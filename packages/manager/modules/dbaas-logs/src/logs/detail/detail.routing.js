export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail', {
    url: '/{serviceName:[a-zA-Z0-9]+-[a-zA-Z0-9-]+}', // logs-12380-1231
    redirectTo: 'dbaas-logs.detail.home',
    views: {
      logsHeader: 'dbaasLogsDashboardHeader',
      logsContainer: 'dbaasLogsDetail',
    },
  });
};
