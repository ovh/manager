export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams', {
    url: '/streams',
    redirectTo: 'dbaas-logs.detail.streams.home',
    views: {
      logsContent: 'dbaasLogsDetailStreams',
    },
  });
};
