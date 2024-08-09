export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.list', {
    url: '',
    views: {
      logsHeader: 'dbaasLogsListHeader',
      logsContainer: 'dbaasLogsList',
    },
    resolve: {
      goToResiliate: /* @ngInject */ ($state) => (serviceName) =>
        $state.go('dbaas-logs.list.resiliate', { serviceName }),
      hideBreadcrumb: () => true,
    },
  });
};
