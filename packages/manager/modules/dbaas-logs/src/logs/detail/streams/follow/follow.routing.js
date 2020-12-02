export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.follow', {
    url: '/follow',
    component: 'dbaasLogsDetailStreamsFollow',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_follow'),
    },
  });
};
