export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.list', {
    url: '',
    views: {
      logsHeader: 'dbaasLogsListHeader',
      logsContainer: 'dbaasLogsList',
    },
  });
};
