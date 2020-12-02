export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.add', {
      url: '/add/:type',
      views: {
        logsAlerts: 'dbaasLogsDetailStreamsAlertsAdd',
      },
    resolve: {
      },
    });
};
