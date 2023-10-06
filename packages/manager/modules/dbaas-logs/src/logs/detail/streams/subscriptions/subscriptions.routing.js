export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.subscriptions', {
    url: '/subscriptions',
    component: 'dbaasLogsDetailStreamsSubscriptions',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_subscriptions'),
    },
  });
};
