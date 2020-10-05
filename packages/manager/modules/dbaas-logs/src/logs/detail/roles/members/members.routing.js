export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.members', {
    url: '/members/:roleId',
    views: {
      logsContent: 'dbaasLogsDetailRolesMembers',
    },
  });
};
