export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.home', {
    url: '',
    views: {
      logsAlerts: 'dbaasLogsDetailStreamsAlertsHome',
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
