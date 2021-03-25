export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.edit', {
    url: '/edit',
    component: 'dbaasLogsDetailStreamsAdd',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_edit'),
    },
  });
};
