export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.alerts.alert.edit', {
    url: '/edit',
    component: 'dbaasLogsDetailStreamsAlertsAdd',
  });
};
