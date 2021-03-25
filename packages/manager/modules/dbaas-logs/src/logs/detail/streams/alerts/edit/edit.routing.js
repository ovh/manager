export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.alert.edit', {
    url: '/edit',
    component: 'dbaasLogsDetailStreamsAlertsAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_alerts_edit'),
    },
  });
};
