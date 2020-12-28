export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.list', {
    url: '/list',
    views: {
      logsHeader: 'dbaasLogsListHeader',
      logsContainer: 'dbaasLogsList',
    },
  });
};
