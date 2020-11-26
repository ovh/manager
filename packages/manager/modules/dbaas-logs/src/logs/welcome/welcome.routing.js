export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.welcome', {
    url: '/welcome',
    views: {
      logsHeader: 'dbaasLogsListHeader',
      logsContainer: 'dbaasLogsWelcome',
    },
  });
};
