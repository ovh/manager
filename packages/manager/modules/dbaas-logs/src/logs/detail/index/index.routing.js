export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.indices', {
    url: '/index',
    views: {
      logsContent: 'dbaasLogsDetailIndex',
    },
  });
};
