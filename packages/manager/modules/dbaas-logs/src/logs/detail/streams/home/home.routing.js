export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.home', {
    url: '/home',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsHome',
    },
  });
};
