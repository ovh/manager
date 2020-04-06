export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.options.home', {
    url: '/home',
    views: {
      logsOptions: 'dbaasLogsDetailOptionsHome',
    },
  });
};
