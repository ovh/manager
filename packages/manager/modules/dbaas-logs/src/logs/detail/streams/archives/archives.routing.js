export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.archives', {
    url: '/:streamId/archives',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsArchives',
    },
  });
};
