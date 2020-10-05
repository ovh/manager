export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.alerts', {
    url: '/:streamId/alerts',
    redirectTo: 'dbaas-logs.detail.streams.alerts.home',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsAlerts',
    },
  });
};
