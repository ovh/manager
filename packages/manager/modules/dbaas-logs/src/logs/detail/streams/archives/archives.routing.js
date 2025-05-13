export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.streams.stream.archives', {
    url: '/archives',
    component: 'dbaasLogsDetailStreamsArchives',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_streams_archives'),
    },
  });
};
