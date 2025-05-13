export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.osd', {
    url: '/osd',
    views: {
      logsContent: 'dbaasLogsDetailOsd',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_osd'),
    },
  });
};
