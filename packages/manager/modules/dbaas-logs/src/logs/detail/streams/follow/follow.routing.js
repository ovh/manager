export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.follow', {
    url: '/:streamId/follow',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsFollow',
    },
  });
};
