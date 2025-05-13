export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.indices', {
    url: '/index',
    views: {
      logsContent: 'dbaasLogsDetailIndex',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_index'),
    },
  });
};
