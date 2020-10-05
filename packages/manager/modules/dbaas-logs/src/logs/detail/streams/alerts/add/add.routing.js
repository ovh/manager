export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('dbaas-logs.detail.streams.alerts.add', {
      url: '/add/:type',
      views: {
        logsAlerts: 'dbaasLogsDetailStreamsAlertsAdd',
      },
    })
    .state('dbaas-logs.detail.streams.alerts.edit', {
      url: '/:alertId',
      views: {
        logsAlerts: 'dbaasLogsDetailStreamsAlertsAdd',
      },
    });
};
