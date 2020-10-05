export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.home', {
    url: '/home',
    views: {
      logsContent: 'dbaasLogsDetailHome',
    },
  });
};
