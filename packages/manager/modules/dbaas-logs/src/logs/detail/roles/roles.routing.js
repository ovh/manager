export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.roles', {
    url: '/roles',
    views: {
      logsContent: 'dbaasLogsDetailRoles',
    },
  });
};
