export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.add', {
    url: '/add',
    views: {
      logsStreams: 'dbaasLogsDetailStreamsAdd',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_add'),
    },
  });
};
