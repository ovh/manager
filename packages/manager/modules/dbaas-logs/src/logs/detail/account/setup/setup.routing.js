export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.setup', {
    url: '/setup',
    views: {
      logsContent: 'dbaasLogsDetailAccountSetup',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_setup'),
    },
  });
};
