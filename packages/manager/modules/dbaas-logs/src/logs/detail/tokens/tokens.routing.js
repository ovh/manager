export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.tokens', {
    url: '/tokens',
    views: {
      logsContent: 'dbaasLogsDetailTokens',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dbaas_logs_token'),
    },
  });
};
