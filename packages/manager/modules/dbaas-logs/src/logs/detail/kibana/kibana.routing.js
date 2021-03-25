export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.kibana', {
    url: '/kibana',
    views: {
      logsContent: 'dbaasLogsDetailKibana',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_kibana'),
    },
  });
};
