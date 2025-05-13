export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts', {
    url: '/alerts',
    redirectTo: 'dbaas-logs.detail.streams.stream.alerts.home',
    component: 'dbaasLogsDetailStreamsAlerts',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_alerts'),
    },
  });

  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.alert', {
    url: '/:alertId',
    redirectTo: 'dbaas-logs.detail.streams.stream.alerts',
    views: {
      logsAlerts: {
        template: '<div ui-view></div>',
      },
    },
    resolve: {
      alertId: /* @ngInject */ ($transition$) => $transition$.params().alertId,
      breadcrumb: /* @ngInject */ (alertId) => alertId,
    },
  });
};
