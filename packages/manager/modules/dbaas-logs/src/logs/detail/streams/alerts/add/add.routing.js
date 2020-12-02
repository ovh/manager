export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.add', {
    url: '/add/:type',
    views: {
      logsAlerts: 'dbaasLogsDetailStreamsAlertsAdd',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_alerts_add'),
    },
  });
};
