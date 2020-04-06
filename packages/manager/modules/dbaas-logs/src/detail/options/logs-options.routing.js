export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.options', {
    url: '/options',
    redirectTo: 'dbaas-logs.detail.options.home',
    views: {
      logsContent: 'dbaasLogsDetailOptions',
    },
  });
};
