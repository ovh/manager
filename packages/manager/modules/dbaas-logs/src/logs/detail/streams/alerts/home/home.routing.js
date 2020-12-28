export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.alerts.home', {
    url: '/',
    views: {
      logsAlerts: 'dbaasLogsDetailStreamsAlertsHome',
    },
  });
};
