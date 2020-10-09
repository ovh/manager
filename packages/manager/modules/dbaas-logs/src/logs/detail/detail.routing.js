export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail', {
    url: '/{serviceName:[a-zA-Z0-9]+-[a-zA-Z0-9-]+}', // logs-12380-1231
    redirectTo: 'dbaas-logs.detail.home',
    views: {
      logsHeader: 'dbaasLogsDashboardHeader',
      logsContainer: 'dbaasLogsDetail',
    },
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      service: /* @ngInject */ (LogsDetailService, serviceName) =>
        LogsDetailService.getServiceDetails(serviceName),
      isAccountDisabled: /* @ngInject */ (LogsHelperService, service) =>
        LogsHelperService.isAccountDisabled(service),
      accountSetupRequired: /* @ngInject */ (LogsHelperService, service) =>
        LogsHelperService.accountSetupRequired(service),
    },
  });
};
