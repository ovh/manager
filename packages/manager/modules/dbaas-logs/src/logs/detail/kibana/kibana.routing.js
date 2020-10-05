export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.kibana', {
    url: '/kibana',
    views: {
      logsContent: 'dbaasLogsDetailKibana',
    },
  });
};
