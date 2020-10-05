export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.streams.add', {
      url: '/add',
      views: {
        logsStreams: 'dbaasLogsDetailStreamsAdd',
      },
    })
    .state('dbaas-logs.detail.streams.edit', {
      url: '/:streamId',
      views: {
        logsStreams: 'dbaasLogsDetailStreamsAdd',
      },
    });
};
